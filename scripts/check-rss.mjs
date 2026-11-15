import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { DOMParser, parseHTML } from 'linkedom';
import { siteTitle, siteDescription } from '../src/lib/site.mjs';

// Compare the feed with the actual built article routes, including custom slugs.
// Run in `npm run build`, so preview and production deployments both enforce it.
export async function checkRss(directory = 'dist') {
  const root = resolve(directory);
  const documents = [];
  async function walk(path) {
    for (const entry of await readdir(path, { withFileTypes: true })) {
      const file = resolve(path, entry.name);
      if (entry.isDirectory()) await walk(file);
      else if (entry.name.endsWith('.html')) {
        documents.push(parseHTML(await readFile(file, 'utf8')).document);
      }
    }
  }
  await walk(root);
  const articles = documents.filter(
    (doc) =>
      doc.querySelector('meta[property="og:type"]')?.getAttribute('content') ===
      'article',
  );
  const xml = new DOMParser().parseFromString(
    await readFile(resolve(root, 'blog/rss.xml'), 'utf8'),
    'text/xml',
  );
  assert.equal(xml.documentElement.localName, 'rss', 'Missing RSS document');
  assert.equal(xml.documentElement.getAttribute('version'), '2.0');
  const channel = xml.querySelector('channel');
  assert(channel, 'Missing RSS channel');
  const value = (node, name) => node.querySelector(name)?.textContent;
  assert.equal(value(channel, 'title'), siteTitle);
  assert.equal(value(channel, 'description'), siteDescription);
  assert.equal(value(channel, 'language'), 'en-AU');
  const items = [...channel.querySelectorAll('item')];
  const links = items.map((item) => value(item, 'link'));
  const canonical = (doc) =>
    doc.querySelector('link[rel="canonical"]')?.getAttribute('href');
  assert.equal(new Set(links).size, links.length, 'Duplicate RSS article');
  assert.deepEqual(
    [...links].sort(),
    articles.map(canonical).sort(),
    'RSS must include every built article, and no unpublished or landing pages',
  );
  for (const doc of documents) {
    const feedLinks = doc.querySelectorAll(
      'link[rel="alternate"][type="application/rss+xml"]',
    );
    assert.equal(feedLinks.length, 1, 'Each page must advertise one RSS feed');
    assert.equal(
      feedLinks[0].getAttribute('href'),
      new URL('/blog/rss.xml', canonical(doc)).href,
    );
  }
  const timestamps = [];
  for (const item of items) {
    const link = value(item, 'link');
    assert.equal(new URL(link).protocol, 'https:');
    const doc = articles.find((article) => canonical(article) === link);
    assert.equal(
      value(item, 'title'),
      doc.querySelector('h1')?.textContent.trim(),
    );
    assert.equal(
      value(item, 'description'),
      doc.querySelector('meta[name="description"]')?.getAttribute('content'),
    );
    const timestamp = Date.parse(value(item, 'pubDate'));
    assert(Number.isFinite(timestamp), 'Invalid RSS publication date');
    assert.equal(
      timestamp,
      Date.parse(
        doc
          .querySelector('meta[property="article:published_time"]')
          ?.getAttribute('content'),
      ),
    );
    timestamps.push(timestamp);
  }
  assert.deepEqual(
    timestamps,
    [...timestamps].sort((a, b) => b - a),
  );
  console.log(
    `RSS verified against ${articles.length} built published articles.`,
  );
  return items;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
)
  await checkRss(process.argv[2]);
