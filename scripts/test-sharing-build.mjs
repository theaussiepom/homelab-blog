import assert from 'node:assert/strict';
import { constants } from 'node:fs';
import {
  cp,
  mkdtemp,
  readdir,
  readFile,
  rm,
  unlink,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, join, relative, sep } from 'node:path';
import { spawnSync } from 'node:child_process';
import { parseHTML } from 'linkedom';
import sharp from 'sharp';

// Exercise the actual Astro pipeline without adding fixtures to the author's working tree.
const root = process.cwd();
const scratch = await mkdtemp(join(tmpdir(), 'blog-sharing-build-'));
const origin = 'https://preview-check.example.test';
const ignored = new Set([
  '.git',
  'node_modules',
  'dist',
  '.astro',
  '.wrangler',
  'test-results',
  'playwright-report',
]);
try {
  await cp(root, scratch, {
    recursive: true,
    filter: (path) => !ignored.has(relative(root, path).split(sep)[0]),
  });
  // Astro's CSS compiler needs dependencies inside the fixture root, not a symlink
  // to another project's node_modules. Reflink where supported; never reinstall.
  await cp(join(root, 'node_modules'), join(scratch, 'node_modules'), {
    recursive: true,
    mode: constants.COPYFILE_FICLONE,
    verbatimSymlinks: true,
    filter: (path) =>
      !relative(join(root, 'node_modules'), path).startsWith('.vite'),
  });
  const build = () => {
    const result = spawnSync(
      process.execPath,
      [join(scratch, 'node_modules/astro/bin/astro.mjs'), 'build'],
      {
        cwd: scratch,
        encoding: 'utf8',
        timeout: 90000,
        env: {
          ...process.env,
          SITE_URL: origin,
          ASTRO_TELEMETRY_DISABLED: '1',
        },
      },
    );
    assert.equal(
      result.status,
      0,
      `${result.error ?? ''}\n${result.stdout}\n${result.stderr}`,
    );
  };
  const guide = join(scratch, 'src/content/docs/guides/share-build-check.md');
  const post = join(scratch, 'src/content/docs/blog/share-build-check.mdx');
  const header = (type, share) =>
    `---\narticleType: ${type}\ntitle: 'A real title with punctuation: “quotes” & choices'\ndescription: A synthetic article used only in the isolated share-preview build test.\ndate: 2026-11-10\nlastUpdated: 2026-11-11\nauthors:\n  - name: Synthetic Preview Author\ntags:\n  - share-build-check\ndraft: false\n${share}\n---\n\nSynthetic preview fixture.\n`;
  await writeFile(
    guide,
    header('guide', 'share:\n  title: A shorter “share” title & its route'),
  );
  await writeFile(
    post,
    header(
      'post',
      'slug: blog/custom-share-route\nhead:\n  - tag: meta\n    attrs:\n      property: og:title\n      content: Wrong legacy title\n  - tag: meta\n    attrs:\n      name: twitter:image\n      content: https://wrong.example.test/image.png\nshare:\n  title: The custom image preview\n  description: A social description that differs from the article description.\n  image: /share-build-check.png\n  imageAlt: A synthetic purple image for testing the override',
    ),
  );
  await sharp({
    create: { width: 128, height: 128, channels: 4, background: '#62429A80' },
  })
    .png()
    .toFile(join(scratch, 'public/share-build-check.png'));
  build();
  const cards = () => readdir(join(scratch, 'dist/og'));
  const first = await cards();
  const parse = async (path) =>
    parseHTML(await readFile(join(scratch, 'dist', path), 'utf8')).document;
  const meta = (doc, name) => {
    const tags = doc.querySelectorAll(
      `meta[property="${name}"],meta[name="${name}"]`,
    );
    assert.equal(tags.length, 1, name);
    return tags[0].getAttribute('content');
  };
  const guideDoc = await parse('guides/share-build-check/index.html');
  const postDoc = await parse('blog/custom-share-route/index.html');
  assert.equal(
    meta(guideDoc, 'og:title'),
    'A shorter “share” title & its route',
  );
  assert.equal(meta(postDoc, 'og:title'), 'The custom image preview');
  assert.equal(meta(postDoc, 'twitter:title'), meta(postDoc, 'og:title'));
  assert.equal(
    meta(postDoc, 'og:description'),
    'A social description that differs from the article description.',
  );
  assert.equal(
    meta(postDoc, 'og:image:alt'),
    'A synthetic purple image for testing the override',
  );
  assert.equal(meta(postDoc, 'og:url'), `${origin}/blog/custom-share-route/`);
  assert.equal(
    meta(postDoc, 'article:published_time'),
    '2026-11-10T00:00:00.000Z',
  );
  assert.equal(
    meta(postDoc, 'article:modified_time'),
    '2026-11-11T00:00:00.000Z',
  );
  assert.equal(postDoc.querySelectorAll('link[rel="canonical"]').length, 1);
  assert.equal(
    postDoc.querySelector('h1').textContent.trim(),
    'A real title with punctuation: “quotes” & choices',
  );
  assert.ok(
    [...postDoc.querySelectorAll('script[type="application/ld+json"]')].some(
      (script) => script.textContent.includes('BlogPosting'),
    ),
    'Retain blog structured data',
  );
  for (const doc of [guideDoc, postDoc]) {
    const image = new URL(meta(doc, 'og:image'));
    assert.equal(image.origin, origin);
    const buffer = await readFile(join(scratch, 'dist', image.pathname));
    const decoded = await sharp(buffer).metadata();
    assert.deepEqual(
      [decoded.width, decoded.height, decoded.hasAlpha],
      [1200, 630, false],
    );
    await sharp(buffer).raw().toBuffer();
  }
  const fixtureCards = [guideDoc, postDoc].map((doc) =>
    basename(new URL(meta(doc, 'og:image')).pathname),
  );
  assert.ok(fixtureCards.every((name) => first.includes(name)));
  const retained = first.filter((name) => !fixtureCards.includes(name)).sort();
  const stale = join(scratch, 'dist/og/stale-card.png');
  await writeFile(stale, 'A stale generated asset that must disappear.');
  await writeFile(
    guide,
    (await readFile(guide, 'utf8')).replace('draft: false', 'draft: true'),
  );
  await unlink(post);
  build();
  assert.deepEqual(
    (await cards()).sort(),
    retained,
    'Removed, unpublished and stale cards must disappear, while retained card URLs stay deterministic',
  );
  for (const path of [
    'guides/share-build-check',
    'blog/custom-share-route',
    'architecture/what-i-built-on-proxmox',
  ]) {
    await assert.rejects(readFile(join(scratch, 'dist', path, 'index.html')), {
      code: 'ENOENT',
    });
  }
  assert.equal(meta(await parse('index.html'), 'og:url'), `${origin}/`);
  console.log(
    'Two isolated Astro builds verified real overrides, custom routes, plugin ordering, PNG decoding, alternate site origin, draft exclusion and stale-card cleanup.',
  );
} finally {
  await rm(scratch, { recursive: true, force: true });
}
