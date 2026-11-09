import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve, relative, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseHTML } from 'linkedom';

export async function checkLinks(directory) {
  const root = resolve(directory);
  const files = [];
  async function walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const path = resolve(dir, entry.name);
      if (entry.isDirectory()) await walk(path);
      else if (entry.name.endsWith('.html')) files.push(path);
    }
  }
  await walk(root);
  if (!files.length) throw new Error('No built HTML pages found.');
  const errors = [];
  for (const file of files) {
    const { document } = parseHTML(await readFile(file, 'utf8'));
    const base = new URL(
      relative(root, file).split(sep).join('/'),
      'https://example.com/',
    );
    for (const element of document.querySelectorAll(
      'a[href], img[src], script[src], link[href]',
    )) {
      const value = element.getAttribute(
        element.hasAttribute('src') ? 'src' : 'href',
      );
      if (
        !value ||
        /^(https?:|mailto:|tel:|data:|javascript:|\/\/)/i.test(value)
      )
        continue;
      const url = new URL(value, base);
      const pathname = decodeURIComponent(url.pathname);
      let target = resolve(root, '.' + pathname);
      if (target !== root && !target.startsWith(root + sep))
        throw new Error('Link escapes output directory.');
      try {
        if ((await stat(target)).isDirectory())
          target = resolve(target, 'index.html');
        await stat(target);
        if (url.hash && target.endsWith('.html')) {
          const page = parseHTML(await readFile(target, 'utf8')).document;
          const id = decodeURIComponent(url.hash.slice(1));
          if (
            !page.getElementById(id) &&
            ![...page.querySelectorAll('a[name]')].some(
              (a) => a.getAttribute('name') === id,
            )
          ) {
            errors.push(`${relative(root, file)}: missing fragment ${value}`);
          }
        }
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
        errors.push(`${relative(root, file)}: missing target ${value}`);
      }
    }
  }
  if (errors.length) throw new Error(errors.join('\n'));
  console.log(
    `Validated internal links, fragments and assets across ${files.length} HTML pages.`,
  );
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  await checkLinks(process.argv[2] || 'dist');
}
