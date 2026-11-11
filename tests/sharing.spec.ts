import { test, expect } from '@playwright/test';
import { readdir } from 'node:fs/promises';
import { parseHTML } from 'linkedom';
import sharp from 'sharp';

test('initial static HTML contains authoritative homepage and article previews', async ({
  request,
}) => {
  const homeResponse = await request.get('/');
  expect(homeResponse.ok()).toBe(true);
  const home = parseHTML(await homeResponse.text()).document;
  const paths = [
    '/',
    ...[...home.querySelectorAll('.hl-feature h2 a, .hl-discovery a')].map(
      (link) => link.getAttribute('href')!,
    ),
  ];
  const generated = new Set<string>();
  const keys = [
    'og:title',
    'og:description',
    'og:type',
    'og:url',
    'og:site_name',
    'og:image',
    'og:image:type',
    'og:image:width',
    'og:image:height',
    'og:image:alt',
    'twitter:card',
    'twitter:title',
    'twitter:description',
    'twitter:image',
    'twitter:image:alt',
  ];
  for (const path of paths) {
    const response = await request.get(path);
    expect(response.ok(), path).toBe(true);
    const document = parseHTML(await response.text()).document;
    const values: Record<string, string> = {};
    for (const key of keys) {
      const matches = document.querySelectorAll(
        `meta[property="${key}"],meta[name="${key}"]`,
      );
      expect(matches.length, `${path} ${key}`).toBe(1);
      values[key] = matches[0].getAttribute('content')!;
      expect(values[key], key).toBeTruthy();
    }
    expect(values['og:site_name']).toBe('The Curious Engineer');
    expect(values['og:type']).toBe(path === '/' ? 'website' : 'article');
    expect(values['og:title']).toBe(
      path === '/'
        ? 'The Curious Engineer'
        : document.querySelector('h1')!.textContent!.trim(),
    );
    expect(values['og:description']).toBe(
      document
        .querySelector('meta[name="description"]')!
        .getAttribute('content'),
    );
    expect(values['og:url']).toBe(`https://theaussiepom.me${path}`);
    const canonical = document.querySelectorAll('link[rel="canonical"]');
    expect(canonical.length).toBe(1);
    expect(canonical[0].getAttribute('href')).toBe(values['og:url']);
    expect(values['twitter:card']).toBe('summary_large_image');
    for (const field of ['title', 'description', 'image', 'image:alt'])
      expect(values[`twitter:${field}`]).toBe(values[`og:${field}`]);
    expect([
      values['og:image:type'],
      values['og:image:width'],
      values['og:image:height'],
    ]).toEqual(['image/png', '1200', '630']);
    const image = new URL(values['og:image']);
    expect(image.origin).toBe('https://theaussiepom.me');
    if (path === '/')
      expect(image.pathname).toBe('/brand/social/tce-opengraph-light.png');
    else {
      expect(image.pathname).toMatch(/^\/og\/[a-f0-9]{64}\.png$/);
      generated.add(image.pathname.split('/').at(-1)!);
      expect(
        document.querySelectorAll('meta[property="article:published_time"]')
          .length,
      ).toBe(1);
      expect(
        document
          .querySelector('meta[property="article:published_time"]')!
          .getAttribute('content'),
      ).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    }
    const asset = await request.get(image.pathname + image.search);
    expect(asset.ok()).toBe(true);
    expect(asset.headers()['content-type']).toContain('image/png');
    const bytes = await asset.body();
    const metadata = await sharp(bytes).metadata();
    expect([metadata.width, metadata.height, metadata.hasAlpha]).toEqual([
      1200,
      630,
      false,
    ]);
    await sharp(bytes).raw().toBuffer();
  }
  expect((await readdir('dist/og')).sort()).toEqual([...generated].sort());
  expect((await request.get('/guides/editorial-draft-canary/')).status()).toBe(
    404,
  );
});
