import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { checkLinks } from './check-links.mjs';

const root = await mkdtemp(join(tmpdir(), 'homelab-link-test-'));
try {
  await writeFile(join(root, 'index.html'), '<a href="/missing/">Broken</a>');
  await assert.rejects(checkLinks(root), /missing target/);
  await writeFile(
    join(root, 'index.html'),
    `<a href="${new URL(process.env.SITE_URL || 'https://theaussiepom.me').origin}/missing/">Broken absolute link</a>`,
  );
  await assert.rejects(checkLinks(root), /missing target/);
  await mkdir(join(root, 'valid'));
  await writeFile(
    join(root, 'valid/index.html'),
    '<h1 id="present">Target</h1>',
  );
  await writeFile(
    join(root, 'index.html'),
    '<a href="/valid/#absent">Broken fragment</a>',
  );
  await assert.rejects(checkLinks(root), /missing fragment/);
  await writeFile(
    join(root, 'index.html'),
    '<a href="/valid/#present">Valid</a>',
  );
  await checkLinks(root);
  const origin = new URL(process.env.SITE_URL || 'https://theaussiepom.me')
    .origin;
  await writeFile(
    join(root, 'index.html'),
    `<a href="${origin}/valid/#present">Absolute valid</a><a href="https://external.example/missing/">External</a>`,
  );
  await checkLinks(root);
  console.log('Negative link and fragment cases fail as expected.');
} finally {
  await rm(root, { recursive: true, force: true });
}
