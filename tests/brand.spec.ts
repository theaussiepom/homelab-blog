import { test, expect } from '@playwright/test';

const story = '/architecture/homelab-proxmox-journey/';
const storyTitle = 'From a NAS VM to Proxmox: five versions of my homelab';

for (const theme of ['light', 'dark']) {
  test(`${theme} portrait masthead fits the header and remains a named home link`, async ({
    page,
  }, testInfo) => {
    await page.addInitScript(
      (value) => localStorage.setItem('starlight-theme', value),
      theme,
    );
    for (const width of [320, 390, 448, 449, 768, 800, 1200]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(story);
      const brand = page.getByRole('link', {
        name: 'The Aussie Pom',
        exact: true,
      });
      await expect(brand).toHaveCount(1);
      const image = brand.locator('img:visible');
      await expect(image).toHaveCount(1);
      const geometry = await image.evaluate(
        async (element: HTMLImageElement) => {
          await element.decode();
          const box = element.getBoundingClientRect();
          const header = element.closest('header')!.getBoundingClientRect();
          return {
            source: element.currentSrc,
            loaded: element.naturalWidth > 0,
            proportion: box.width / box.height,
            original: element.naturalWidth / element.naturalHeight,
            insideHeader: box.top >= header.top && box.bottom <= header.bottom,
            overflow: document.documentElement.scrollWidth > innerWidth,
          };
        },
      );
      expect(geometry.loaded).toBe(true);
      expect(geometry.source).toContain(`on-${theme}.svg`);
      expect(geometry.proportion).toBeCloseTo(geometry.original, 1);
      expect(geometry.insideHeader, `${width}px`).toBe(true);
      expect(geometry.overflow, `${width}px`).toBe(false);
      const box = await brand.boundingBox();
      const search = await page
        .getByRole('button', { name: /^Search/ })
        .first()
        .boundingBox();
      expect(box!.x + box!.width).toBeLessThanOrEqual(search!.x);
      if (width === 390 || width === 1200) {
        await page.screenshot({
          path: testInfo.outputPath(`brand-${theme}-${width}.png`),
        });
      }
    }
    const brand = page.getByRole('link', {
      name: 'The Aussie Pom',
      exact: true,
    });
    await brand.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL('/');
  });
}

test('branded icons and sharing metadata preserve each article identity', async ({
  page,
  request,
}) => {
  for (const path of ['/', story]) {
    await page.goto(path);
    const image = page.locator('meta[property="og:image"]');
    await expect(image).toHaveCount(1);
    if (path === '/') {
      await expect(image).toHaveAttribute(
        'content',
        'https://theaussiepom.me/brand/social/tap-opengraph-light.png?v=3',
      );
    } else {
      await expect(image).toHaveAttribute(
        'content',
        /^https:\/\/theaussiepom\.me\/og\/[a-f0-9]{64}\.png$/,
      );
    }
    await expect(
      page.locator('meta[property="og:image:width"]'),
    ).toHaveAttribute('content', '1200');
    await expect(
      page.locator('meta[property="og:image:height"]'),
    ).toHaveAttribute('content', '630');
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
      'content',
      (await image.getAttribute('content'))!,
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://theaussiepom.me${path}`,
    );
    if (path === story) {
      const description = await page
        .locator('meta[name="description"]')
        .getAttribute('content');
      if (description === null)
        throw new Error('Article description is missing.');
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
        'content',
        description,
      );
      await expect(page).toHaveTitle(`${storyTitle} | The Aussie Pom`);
      await expect(
        page.locator('meta[property="og:description"]'),
      ).toHaveAttribute('content', description);
    }
  }
  for (const href of await page
    .locator(
      'link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]',
    )
    .evaluateAll((links) => links.map((link) => link.getAttribute('href')!))) {
    expect((await request.get(href)).ok(), href).toBe(true);
  }
  await expect(page.locator('link[rel="manifest"]')).toHaveCount(1);
  const manifestPath = await page
    .locator('link[rel="manifest"]')
    .getAttribute('href');
  const response = await request.get(manifestPath!);
  expect(response.ok()).toBe(true);
  const manifest = await response.json();
  expect(manifest.name).toBe('The Aussie Pom');
  expect(manifest.display).toBe('browser');
  expect(
    manifest.icons.some(
      (icon: { purpose: string }) => icon.purpose === 'maskable',
    ),
  ).toBe(true);
  for (const icon of manifest.icons) {
    const asset = await request.get(icon.src);
    expect(asset.ok(), icon.src).toBe(true);
    const bytes = await asset.body();
    expect(`${bytes.readUInt32BE(16)}x${bytes.readUInt32BE(20)}`).toBe(
      icon.sizes,
    );
  }
  const social = await request.get('/brand/social/tap-opengraph-light.png');
  expect(social.ok()).toBe(true);
  const bytes = await social.body();
  expect([bytes.readUInt32BE(16), bytes.readUInt32BE(20)]).toEqual([1200, 630]);
});
