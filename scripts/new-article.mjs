import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = fileURLToPath(new URL('../', import.meta.url));
const sections = {
  guide: 'guides',
  architecture: 'architecture',
  investigation: 'investigations',
  post: 'blog',
};
const contentExtensions = [
  'md',
  'mdx',
  'markdown',
  'mdown',
  'mkdn',
  'mkd',
  'mdwn',
];

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

/** Create a draft from the repository's editorial template without replacing content. */
export async function newArticle(
  kind,
  slug,
  { root = repositoryRoot, now = new Date() } = {},
) {
  if (!Object.hasOwn(sections, kind)) {
    throw new Error('Kind must be guide, architecture, investigation or post.');
  }
  if (
    typeof slug !== 'string' ||
    slug.length > 80 ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
  ) {
    throw new Error(
      'Slug must be lowercase kebab-case, at most 80 characters.',
    );
  }
  if (!(now instanceof Date) || !Number.isFinite(now.getTime())) {
    throw new Error('The article date must be valid.');
  }
  if (kind === 'post' && slug === 'index') {
    throw new Error(
      'Article route already exists: /blog/ is the generated blog index.',
    );
  }

  const section = join(resolve(root), 'src/content/docs', sections[kind]);
  const target = join(section, `${slug}.mdx`);
  // A different Markdown extension or an index directory would occupy the same route.
  const collisions = [
    join(section, slug),
    ...contentExtensions.map((extension) =>
      join(section, `${slug}.${extension}`),
    ),
  ];
  for (const candidate of collisions) {
    if (await exists(candidate)) {
      throw new Error(`Article route already exists: ${candidate}`);
    }
  }

  const template = await readFile(
    join(resolve(root), 'docs/editorial/templates', `${kind}.mdx`),
    'utf8',
  );
  const words = slug.replaceAll('-', ' ');
  // The validated slug contains no YAML quote or escape characters.
  const title = `Draft: ${words[0].toUpperCase()}${words.slice(1)}`;
  const date = now.toISOString().slice(0, 10);
  const content = template
    .replaceAll('{{TITLE}}', title)
    // Template tokens are quoted for valid YAML; Astro expects a YAML date value.
    .replaceAll("'{{DATE}}'", date)
    .replaceAll('"{{DATE}}"', date)
    .replaceAll('{{DATE}}', date);
  if (/\{\{[A-Z_]+\}\}/.test(content)) {
    throw new Error('The template contains unsupported replacement tokens.');
  }

  await mkdir(dirname(target), { recursive: true });
  // Exclusive creation also protects against another writer winning after the check.
  await writeFile(target, content, { flag: 'wx' });
  return target;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    const args = process.argv.slice(2);
    if (args.length !== 2) {
      throw new Error(
        'Usage: npm run new:article -- <kind> <lowercase-kebab-slug>',
      );
    }
    const target = await newArticle(...args);
    console.log(`Created draft: ${target}`);
    console.log(
      'Replace REPLACE_AUTHOR and template guidance, then preview with npm run dev.',
    );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
