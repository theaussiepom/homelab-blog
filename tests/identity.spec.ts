import { test, expect } from '@playwright/test';
import { parseHTML } from 'linkedom';

const story = '/architecture/homelab-proxmox-journey/';
const profiles = [
  ['Ben Dennis on GitHub', 'https://github.com/theaussiepom'],
  ['Ben Dennis on LinkedIn', 'https://www.linkedin.com/in/theaussiepom/'],
  ['RSS', 'https://theaussiepom.me/blog/rss.xml'],
];

for (const theme of ['light', 'dark']) {
  test(`${theme} identity, About and profile controls fit desktop and mobile`, async ({
    page,
  }, testInfo) => {
    await page.addInitScript(
      (value) => localStorage.setItem('starlight-theme', value),
      theme,
    );
    for (const width of [320, 390, 800, 1200]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const path of ['/', '/about/', story, '/blog/']) {
        await page.goto(path);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        const brand = page.getByRole('link', {
          name: 'The Aussie Pom',
          exact: true,
        });
        await expect(brand).toBeVisible();
        await page.keyboard.press('Tab');
        await brand.focus();
        expect(
          await brand.evaluate((link) => link.matches(':focus-visible')),
        ).toBe(true);
        if (path === '/') {
          await expect(page.locator('h1')).toHaveText(
            'There’s always one more thing to build.',
          );
          await expect(page.locator('.hl-supporting-line')).toHaveText(
            'Software, systems and curiosity in action.',
          );
          await expect(page.locator('.hl-about-link')).toHaveAttribute(
            'href',
            '/about/',
          );
          await expect(page.locator('.hl-author-bio')).toHaveCount(0);
        }
        if (path === '/about/') {
          await expect(page.locator('h1')).toHaveText('About Ben Dennis');
          await expect(
            page.getByRole('img', { name: 'Ben Dennis at the beach' }),
          ).toBeVisible();
          const words = (
            await page.locator('.hl-about-author p').allTextContents()
          )
            .join(' ')
            .trim()
            .split(/\s+/).length;
          expect(words).toBeGreaterThanOrEqual(250);
          expect(words).toBeLessThanOrEqual(400);
          await expect(page.locator('.hl-author-bio')).toHaveCount(0);
          await expect(page.locator('#comments-heading')).toHaveCount(0);
        }
        if (path === story) {
          await expect(page.locator('.hl-article-meta')).toContainText(
            'Ben Dennis',
          );
          const bio = page.getByRole('region', { name: 'About Ben Dennis' });
          const words = (await bio.locator('p').innerText())
            .trim()
            .split(/\s+/).length;
          expect(words).toBeGreaterThanOrEqual(40);
          expect(words).toBeLessThanOrEqual(60);
          await expect(
            bio.getByRole('link', { name: 'More about Ben', exact: true }),
          ).toHaveAttribute('href', '/about/');
        }
        let social = page.locator('header .social-icons');
        if (width < 800) {
          await page.getByRole('button', { name: 'Menu', exact: true }).click();
          const browse = page.locator('.hl-site-links');
          if (
            (await browse.count()) &&
            (await browse.locator(':scope > summary').isVisible())
          )
            await browse.locator(':scope > summary').click();
          await expect(
            page
              .locator('#starlight__sidebar')
              .getByRole('link', { name: 'About Ben', exact: true }),
          ).toBeVisible();
          social = page.locator('.mobile-preferences .social-icons');
        }
        const links = social.locator('.hl-social-link');
        expect(
          await links.evaluateAll((items) =>
            items.map((a) => [
              a.getAttribute('aria-label'),
              a.getAttribute('href'),
            ]),
          ),
        ).toEqual(profiles);
        for (const link of await links.all()) {
          await expect(link).toBeVisible();
          expect(await link.getAttribute('title')).toBeTruthy();
          await page.keyboard.press('Tab');
          await link.focus();
          expect(await link.evaluate((a) => a.matches(':focus-visible'))).toBe(
            true,
          );
          const box = await link.boundingBox();
          expect(box!.width).toBeGreaterThanOrEqual(44);
          expect(box!.height).toBeGreaterThanOrEqual(44);
        }
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        if (width < 800)
          await page
            .getByRole('button', { name: 'Close', exact: true })
            .click();
        if (path !== '/blog/' && (width === 390 || width === 1200)) {
          const name =
            path === '/' ? 'home' : path === '/about/' ? 'about' : 'article';
          await page.screenshot({
            path: testInfo.outputPath(`${name}-${theme}-${width}.png`),
            fullPage: name === 'about',
          });
        }
      }
    }
  });
}

test('new identity and profile metadata are static and preserve article routes', async ({
  request,
}) => {
  for (const path of [
    '/',
    '/about/',
    '/blog/',
    story,
    '/architecture/proxmox-without-kubernetes/',
    '/architecture/what-i-built-on-proxmox/',
  ]) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    const html = await response.text();
    // A regression sentinel for retired active branding, not another publication name.
    expect(html).not.toContain('The Curious Engineer');
    const document = parseHTML(html).document;
    expect(
      document.querySelectorAll('#starlight__sidebar a[href="/about/"]').length,
    ).toBe(1);
    expect(document.querySelectorAll('meta[name="author"]').length).toBe(1);
    expect(
      document.querySelector('meta[name="author"]')!.getAttribute('content'),
    ).toBe('Ben Dennis');
    expect(document.querySelectorAll('#site-identity').length).toBe(1);
    const identity = JSON.parse(
      document.querySelector('#site-identity')!.textContent!,
    );
    const person = identity['@graph'].find(
      (node: Record<string, unknown>) => node['@type'] === 'Person',
    );
    expect(person.name).toBe('Ben Dennis');
    expect(person.url).toBe('https://theaussiepom.me/about/');
    expect(person.sameAs).toEqual(profiles.slice(0, 2).map(([, href]) => href));
    expect(
      document.querySelectorAll(
        'link[rel="alternate"][type="application/rss+xml"]',
      ).length,
    ).toBe(1);
    expect(
      document.querySelector('link[rel="canonical"]')!.getAttribute('href'),
    ).toBe(`https://theaussiepom.me${path}`);
    if (path === '/about/')
      expect(
        identity['@graph'].some(
          (node: Record<string, unknown>) => node['@type'] === 'AboutPage',
        ),
      ).toBe(true);
  }
  const feed = await request.get('/blog/rss.xml');
  const xml = await feed.text();
  expect(xml).toContain('The Aussie Pom');
  expect(xml).not.toContain('The Curious Engineer');
});
