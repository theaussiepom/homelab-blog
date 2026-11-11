import assert from 'node:assert/strict';
import { z } from 'astro/zod';
import { articleFields, validateArticle } from '../src/lib/editorial.mjs';
import { createSatteriMarkdownProcessor } from '@astrojs/markdown-satteri';
import { articleReadingTime } from '../src/lib/reading-time.mjs';
import { author } from '../src/lib/author.mjs';

const processor = await createSatteriMarkdownProcessor({
  mdastPlugins: [articleReadingTime],
});
for (const [words, minutes] of [
  [1, 1],
  [200, 1],
  [201, 2],
  [400, 2],
  [401, 3],
]) {
  const result = await processor.render('word '.repeat(words));
  assert.equal(result.metadata.frontmatter.minutesRead, minutes);
}
const linkedText = await processor.render(
  `[One word](https://example.com/${'ignored/'.repeat(500)})\n\n<!-- ${'ignored '.repeat(500)} -->`,
);
assert.equal(linkedText.metadata.frontmatter.minutesRead, 1);

const schema = articleFields
  .extend({ draft: z.boolean().default(false) })
  .superRefine(validateArticle);
const article = {
  articleType: 'guide',
  title: 'Synthetic sample',
  description: 'A synthetic sample for editorial validation.',
  date: new Date('2026-11-10'),
  authors: [{ name: 'HomeLab Notes' }],
  tags: ['synthetic'],
};
for (const articleType of ['guide', 'architecture', 'investigation', 'post'])
  assert.ok(schema.safeParse({ ...article, articleType }).success);
const legacyAuthor = { name: 'Ben' };
const resolved = schema.parse({ ...article, authors: [legacyAuthor] });
assert.equal(legacyAuthor.name, 'Ben', 'Do not rewrite the source attribution');
assert.equal(resolved.authors[0].name, author.name);
assert.equal(resolved.authors[0].url, 'https://theaussiepom.me/about/');
assert.deepEqual(schema.parse(article).authors, article.authors);
assert.ok(schema.safeParse({ articleType: 'page', title: 'Index' }).success);
for (const field of ['description', 'date', 'authors', 'tags']) {
  const invalid = { ...article };
  delete invalid[field];
  assert.equal(
    schema.safeParse(invalid).success,
    false,
    `missing ${field} must fail`,
  );
}
for (const change of [
  { articleType: 'typo' },
  { title: ' ' },
  { description: '' },
  { date: '2026-11-10' },
  { date: new Date('invalid') },
  { lastUpdated: new Date('2026-11-09') },
  { authors: [] },
  { authors: [{ name: ' ' }] },
  { tags: [] },
  { tags: ['Invalid Tag'] },
  { tags: ['same', 'same'] },
  { title: 'Draft: unfinished' },
  { authors: [{ name: 'REPLACE_AUTHOR' }] },
])
  assert.equal(
    schema.safeParse({ ...article, ...change }).success,
    false,
    JSON.stringify(change),
  );
assert.ok(
  schema.safeParse({
    ...article,
    draft: true,
    title: 'Draft: unfinished',
    authors: [{ name: 'REPLACE_AUTHOR' }],
  }).success,
);
console.log(
  'Editorial metadata accepts all four article types and rejects invalid/incomplete publication metadata.',
);

const { mkdtemp, writeFile, rm } = await import('node:fs/promises');
const { tmpdir } = await import('node:os');
const { join } = await import('node:path');
const { checkDrafts } = await import('./check-drafts.mjs');
const root = await mkdtemp(join(tmpdir(), 'editorial-draft-check-'));
try {
  await assert.rejects(checkDrafts(root), /No production documents/);
  await writeFile(
    join(root, 'index.html'),
    '<p>editorialdraftcanaryguides</p>',
  );
  await assert.rejects(checkDrafts(root), /Draft content leaked/);
  await writeFile(
    join(root, 'index.html'),
    '<p>Published synthetic content</p>',
  );
  await checkDrafts(root);
} finally {
  await rm(root, { recursive: true, force: true });
}
