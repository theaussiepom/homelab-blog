import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = [
  '/',
  '/start-here/',
  '/guides/',
  '/guides/placeholder/',
  '/architecture/',
  '/investigations/',
  '/blog/',
  '/blog/foundation-placeholder/',
];
for (const path of pages) {
  test(`renders accessibly: ${path}`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    // The blog plugin intentionally hides the index title panel.
    if (path === '/blog/') {
      await expect(
        page
          .getByRole('link', {
            name: 'Placeholder — the publishing foundation',
            exact: true,
          })
          .last(),
      ).toBeVisible();
    } else {
      await expect(page.locator('h1')).toBeVisible();
    }
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
test('search returns the placeholder documentation article', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: /search/i }).click();
  await page
    .locator('.pagefind-ui__search-input')
    .fill('synthetic publishing lighthouse');
  await expect(page.locator('.pagefind-ui__result-link').first()).toContainText(
    'Placeholder documentation article',
  );
  await page.locator('.pagefind-ui__result-link').first().click();
  await expect(page).toHaveURL(/guides\/placeholder/);
});
test('documentation has a table of contents and metadata', async ({ page }) => {
  await page.goto('/guides/placeholder/');
  await expect(page.locator('starlight-toc').first()).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    /guides\/placeholder/,
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    /Synthetic content/,
  );
});
test('mobile navigation and layout', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/start-here/');
  await page.getByRole('button', { name: /menu/i }).click();
  // Starlight's nav wrapper uses display: contents; test the native popover and usable link.
  await expect(page.locator('#starlight__sidebar')).toBeVisible();
  await page
    .locator('#starlight__sidebar')
    .getByRole('link', {
      name: 'Placeholder documentation article',
      exact: true,
    })
    .click();
  await expect(page).toHaveURL(/guides\/placeholder/);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
test('RSS and sitemap contain real generated routes', async ({ request }) => {
  const rss = await request.get('/blog/rss.xml');
  expect(rss.status()).toBe(200);
  expect(await rss.text()).toContain('/blog/foundation-placeholder/');
  const index = await request.get('/sitemap-index.xml');
  expect(index.status()).toBe(200);
  expect(await index.text()).toContain('sitemap-0.xml');
  const sitemap = await request.get('/sitemap-0.xml');
  expect(await sitemap.text()).toContain('/guides/placeholder/');
});
