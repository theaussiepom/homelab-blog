import { createHash } from 'node:crypto';
import { lstat, readFile, readdir } from 'node:fs/promises';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const archive = join(root, 'brand');
for (const directory of [root, join(root, 'public')]) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (
      entry.isDirectory() &&
      entry.name !== 'brand' &&
      /^(?:brand(?:[ _-].+|v\d.*)|The-Curious-Engineer-Brand-Suite.*)$/i.test(
        entry.name,
      )
    ) {
      throw new Error(
        `Use the single authoritative brand/ kit; remove the extra kit folder: ${relative(root, join(directory, entry.name))}`,
      );
    }
  }
}
const manifest = await readFile(join(archive, 'ASSET-MANIFEST.csv'), 'utf8');
const [header, ...rows] = manifest.trim().split(/\r?\n/);
if (header !== 'File,Format,Width,Height,Bytes,SHA256') {
  throw new Error('Unrecognised brand manifest header.');
}
const originals = new Map();
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
for (const row of rows) {
  const fields = row.split(',');
  if (fields.length !== 6) throw new Error('Unrecognised brand manifest row.');
  const [name, , , , size, digest] = fields;
  const path = resolve(archive, name);
  if (!path.startsWith(archive + sep) || originals.has(name)) {
    throw new Error('Invalid or duplicate brand asset path.');
  }
  if (!(await lstat(path)).isFile())
    throw new Error(`Not a brand file: ${name}`);
  const bytes = await readFile(path);
  if (bytes.length !== Number(size) || hash(bytes) !== digest) {
    throw new Error(`Archived brand asset differs from its manifest: ${name}`);
  }
  originals.set(name, digest);
}

async function* files(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) yield* files(path);
    else if (entry.isFile()) yield path;
    else throw new Error('Brand asset directories must not contain symlinks.');
  }
}

for await (const path of files(archive)) {
  const name = relative(archive, path).split(sep).join('/');
  if (name !== 'ASSET-MANIFEST.csv' && !originals.has(name)) {
    throw new Error(`Unlisted or retired asset in the brand archive: ${name}`);
  }
}

const publicBrand = join(root, 'public/brand');
let deployed = 0;
for await (const path of files(publicBrand)) {
  const name = relative(publicBrand, path).split(sep).join('/');
  if (hash(await readFile(path)) !== originals.get(name)) {
    throw new Error(`Public brand asset differs from its original: ${name}`);
  }
  deployed++;
}
if (
  hash(await readFile(join(root, 'public/favicon.svg'))) !==
  originals.get('favicons/favicon.svg')
) {
  throw new Error('The legacy favicon URL must use the supplied artwork.');
}
console.log(
  `Verified ${originals.size} original brand assets, ${deployed} public copies and the favicon alias.`,
);
