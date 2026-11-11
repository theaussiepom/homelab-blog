import assert from 'node:assert/strict';
import sharp from 'sharp';
import { articleFields, isPublishedArticle } from '../src/lib/editorial.mjs';
import {
  createArticleImage,
  loadCardAssets,
  renderCardSvg,
} from '../src/lib/share-cards.mjs';
import { withShareMetadata } from '../src/lib/share-metadata.mjs';

const assets = await loadCardAssets();
const article = {
  title: 'Why I chose not to use Kubernetes inside Proxmox',
  description:
    'I got Kubernetes working. As the Proxmox build took shape, I had fewer reasons to keep it.',
  articleType: 'architecture',
  draft: false,
  date: new Date('2026-11-11'),
};
const siteTitle = 'The Aussie Pom';
const origin = 'https://previews.example.test/';
const card = await createArticleImage(article, siteTitle, origin, assets);
const metadata = await sharp(card.png).metadata();
assert.equal(metadata.format, 'png');
assert.deepEqual(
  [metadata.width, metadata.height, metadata.hasAlpha],
  [1200, 630, false],
);
await sharp(card.png).raw().toBuffer();
assert.match(card.path, /^\/og\/[a-f0-9]{64}\.png$/);
assert.equal(card.layout.lines.join(' '), article.title);
assert.equal(
  (await createArticleImage(article, siteTitle, origin, assets)).id,
  card.id,
);
assert.equal(
  (
    await createArticleImage(
      { ...article, description: 'Only metadata changed.' },
      siteTitle,
      origin,
      assets,
    )
  ).id,
  card.id,
);

for (const title of [
  'Ben’s “one more service”: YAML, USB & a rather busy homelab',
  'Juggling a few services while learning how all the parts fit together, without losing the plot or the weekend',
]) {
  const image = await createArticleImage(
    { ...article, title },
    siteTitle,
    origin,
    assets,
  );
  assert.equal(image.layout.lines.join(' '), title);
  assert.ok(image.layout.size >= 52 && image.layout.size <= 78);
  for (const box of image.layout.boxes) {
    assert.ok(box.x1 >= 72 && box.x2 <= 1128 && box.y1 >= 146 && box.y2 <= 450);
  }
}
await assert.rejects(
  createArticleImage(
    { ...article, title: 'Unreasonably long '.repeat(60) },
    siteTitle,
    origin,
    assets,
  ),
  /share.title/,
);
await assert.rejects(
  createArticleImage(
    { ...article, title: 'Unsupported 🦄' },
    siteTitle,
    origin,
    assets,
  ),
  /cannot render/,
);
assert.equal(
  (
    await createArticleImage(
      {
        ...article,
        title: 'Unsupported 🦄',
        share: { title: 'A supported alternative' },
      },
      siteTitle,
      origin,
      assets,
    )
  ).layout.lines.join(' '),
  'A supported alternative',
);

for (const changed of [
  { ...assets, font: Buffer.concat([assets.font, Buffer.from([0])]) },
  { ...assets, portrait: assets.portrait.replace('#E2D7F5', '#E2D7F4') },
  { ...assets, template: assets.template.replace('#FAF8F3', '#FAF8F2') },
])
  assert.notEqual(
    (await createArticleImage(article, siteTitle, origin, changed)).id,
    card.id,
  );
for (const changed of [
  { ...article, title: `${article.title}?` },
  { ...article, articleType: 'investigation' },
  { ...article, share: { title: 'The shorter share title' } },
])
  assert.notEqual(
    (await createArticleImage(changed, siteTitle, origin, assets)).id,
    card.id,
  );
assert.notEqual(
  (
    await createArticleImage(
      article,
      siteTitle,
      'https://another.example.test',
      assets,
    )
  ).id,
  card.id,
);
assert.notEqual(
  (await createArticleImage(article, 'A different publication', origin, assets))
    .id,
  card.id,
);
assert.ok(
  !renderCardSvg(
    {
      title: article.title,
      category: 'architecture',
      publication: siteTitle,
      domain: 'example.test',
    },
    assets,
  ).svg.includes('<text'),
);

for (const data of [
  { ...article, draft: true },
  { ...article, articleType: 'page' },
]) {
  assert.equal(isPublishedArticle(data), false);
  await assert.rejects(
    createArticleImage(data, siteTitle, origin, assets),
    /only for published/,
  );
}
for (const share of [
  { title: ' ' },
  { title: 'x'.repeat(181) },
  { description: 'short' },
  { image: 'https://external.example.test/image.png', imageAlt: 'External' },
  { image: '//external.example.test/image.png', imageAlt: 'External' },
  { image: '/../outside.png', imageAlt: 'Traversal' },
  { image: '/image.svg', imageAlt: 'Vector' },
  { image: '/image.png' },
  { imageAlt: ' ' },
  { typo: 'unknown' },
])
  assert.equal(
    articleFields.safeParse({ ...article, share }).success,
    false,
    JSON.stringify(share),
  );
assert.ok(
  articleFields.safeParse({
    ...article,
    share: {
      title: 'Shorter',
      description: article.description,
      image: '/brand/social/tap-opengraph-light.png',
      imageAlt: 'The approved publication artwork',
    },
  }).success,
);

const head = [
  { tag: 'title', content: 'Native browser title' },
  { tag: 'meta', attrs: { name: 'description', content: article.description } },
  { tag: 'script', attrs: { type: 'application/ld+json' }, content: '{}' },
  {
    tag: 'link',
    attrs: {
      rel: 'alternate',
      type: 'application/rss+xml',
      href: '/blog/rss.xml',
    },
  },
  {
    tag: 'link',
    attrs: { rel: 'canonical', href: 'https://wrong.example.test/' },
  },
  { tag: 'meta', attrs: { property: 'og:image', content: 'wrong' } },
  { tag: 'meta', attrs: { property: 'og:image', content: 'duplicate' } },
  { tag: 'meta', attrs: { name: 'og:title', content: 'wrong attribute' } },
  { tag: 'meta', attrs: { name: 'twitter:title', content: 'wrong' } },
];
const result = withShareMetadata(head, {
  data: {
    ...article,
    share: {
      title: 'The short title',
      description: 'A separate description for the preview.',
    },
  },
  siteTitle,
  pathname: '/actual-route/',
  site: origin,
  image: card,
  lastUpdated: new Date('2026-11-12'),
});
const value = (key) => {
  const matches = result.filter(
    ({ tag, attrs }) =>
      tag === 'meta' && (attrs?.property === key || attrs?.name === key),
  );
  assert.equal(matches.length, 1, key);
  return matches[0].attrs.content;
};
assert.equal(value('og:title'), 'A separate description for the preview.');
assert.equal(value('og:title'), value('og:description'));
assert.equal(value('twitter:title'), value('og:title'));
assert.equal(value('twitter:description'), value('og:description'));
assert.equal(value('twitter:image'), value('og:image'));
assert.equal(value('og:url'), `${origin}actual-route/`);
assert.equal(value('og:type'), 'article');
assert.equal(value('article:modified_time'), '2026-11-12T00:00:00.000Z');
assert.ok(
  result.includes(head[0]) &&
    result.includes(head[2]) &&
    result.includes(head[3]),
);
assert.equal(
  result.filter(
    ({ tag, attrs }) => tag === 'link' && attrs?.rel === 'canonical',
  ).length,
  1,
);
for (const data of [
  article,
  { ...article, share: { title: 'Card title only' } },
]) {
  const metadata = withShareMetadata(head, {
    data,
    siteTitle,
    pathname: '/actual-route/',
    site: origin,
    image: card,
  });
  assert.equal(
    metadata.find(({ attrs }) => attrs?.property === 'og:title').attrs.content,
    article.description,
  );
}
const home = withShareMetadata(head, {
  data: { title: 'Home', description: article.description },
  siteTitle,
  pathname: '/',
  site: origin,
});
assert.equal(
  home.find(({ attrs }) => attrs?.property === 'og:title').attrs.content,
  siteTitle,
);
assert.throws(
  () =>
    withShareMetadata(head, {
      data: article,
      siteTitle,
      pathname: '/',
      site: 'http://example.test/',
    }),
  /HTTPS/,
);
console.log(
  'Share cards: deterministic opaque PNGs, complete bounded text, cache changes, draft refusal, schema overrides and metadata merging verified.',
);
