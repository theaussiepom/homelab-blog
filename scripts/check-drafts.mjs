import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// These deliberately synthetic fixtures must remain unpublished in every production build.
export async function checkDrafts(directory) {
  let count = 0;
  async function walk(path) {
    for (const entry of await readdir(path, { withFileTypes: true })) {
      const file = resolve(path, entry.name);
      if (/editorial-draft-canary|draft-canary-author/.test(entry.name))
        throw new Error(`Draft route leaked: ${file}`);
      if (entry.isDirectory()) await walk(file);
      else if (/\.(html|xml|json)$/.test(entry.name)) {
        count++;
        if (
          /editorialdraftcanary|Draft Canary Author|draft-canary|Draft canary for/.test(
            await readFile(file, 'utf8'),
          )
        ) {
          throw new Error(`Draft content leaked: ${file}`);
        }
      }
    }
  }
  await walk(resolve(directory));
  if (!count) throw new Error('No production documents found.');
  console.log(
    `Draft canaries absent from ${count} generated documents and route names.`,
  );
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
)
  await checkDrafts(process.argv[2] || 'dist');
