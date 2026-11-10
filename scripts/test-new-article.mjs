import assert from 'node:assert/strict';
import { compile } from '@mdx-js/mdx';
import {
  cp,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { newArticle } from './new-article.mjs';

const root = await mkdtemp(join(tmpdir(), 'homelab-article-test-'));
const now = new Date('2026-11-10T01:00:00Z');
const sections = {
  guide: 'guides',
  architecture: 'architecture',
  investigation: 'investigations',
  post: 'blog',
};

async function snapshot(directory) {
  const files = {};
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) Object.assign(files, await snapshot(path));
    else files[path] = await readFile(path, 'utf8');
  }
  return files;
}

try {
  await mkdir(join(root, 'docs/editorial'), { recursive: true });
  await cp(
    fileURLToPath(new URL('../docs/editorial/templates/', import.meta.url)),
    join(root, 'docs/editorial/templates'),
    { recursive: true },
  );

  for (const [kind, section] of Object.entries(sections)) {
    const target = await newArticle(kind, `sample-${kind}`, { root, now });
    assert.equal(
      target,
      join(root, 'src/content/docs', section, `sample-${kind}.mdx`),
    );
    const content = await readFile(target, 'utf8');
    assert.match(content, new RegExp(`title: ['"]Draft: Sample ${kind}['"]`));
    assert.match(content, /^draft: true$/m);
    assert.match(content, /^date: 2026-11-10$/m);
    assert.match(content, /REPLACE_AUTHOR/);
    assert.doesNotMatch(content, /\{\{(?:TITLE|DATE)\}\}/);
    // Formatting must not turn source-only authoring notes into invalid MDX.
    await compile(content.replace(/^---[\s\S]*?---\s*/, ''));
    await assert.rejects(
      newArticle(kind, `sample-${kind}`, { root, now }),
      /already exists/,
    );
    assert.equal(await readFile(target, 'utf8'), content);
  }

  const existingMarkdown = join(root, 'src/content/docs/guides/existing.md');
  await writeFile(existingMarkdown, 'Existing content must survive.\n');
  await mkdir(join(root, 'src/content/docs/guides/existing-index'));
  await writeFile(
    join(root, 'src/content/docs/guides/existing-index/index.mdx'),
    'Existing index.\n',
  );
  const before = await snapshot(root);
  for (const slug of [
    '../escape',
    'a/b',
    '/absolute',
    '',
    '-start',
    'end-',
    'two--hyphens',
    'Uppercase',
    'has space',
    'a'.repeat(81),
  ]) {
    await assert.rejects(newArticle('guide', slug, { root, now }), /Slug must/);
  }
  for (const kind of ['unknown', '../guide', '__proto__', 'constructor']) {
    await assert.rejects(
      newArticle(kind, 'untouched', { root, now }),
      /Kind must/,
    );
  }
  await assert.rejects(
    newArticle('guide', 'untouched', { root, now: new Date('invalid') }),
    /date must be valid/,
  );
  await assert.rejects(
    newArticle('guide', 'existing', { root, now }),
    /already exists/,
  );
  await assert.rejects(
    newArticle('guide', 'existing-index', { root, now }),
    /already exists/,
  );
  await assert.rejects(
    newArticle('post', 'index', { root, now }),
    /already exists/,
  );
  assert.deepEqual(await snapshot(root), before);
  console.log(
    'All four real templates create drafts; invalid inputs and route collisions leave files unchanged.',
  );
} finally {
  await rm(root, { recursive: true, force: true });
}
