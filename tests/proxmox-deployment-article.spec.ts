import { test, expect } from '@playwright/test';

const route = '/architecture/what-i-built-on-proxmox/';
const title = 'How I deploy my Proxmox homelab with GitHub Actions';

test('the deployment story is discoverable and its illustrations fit both themes', async ({
  page,
  request,
}, testInfo) => {
  await page.goto('/');
  await page
    .locator('.hl-discovery')
    .getByRole('link', { name: title, exact: true })
    .click();
  await expect(page).toHaveURL(route);
  await expect(page.locator('.hl-draft')).toHaveCount(0);
  await expect(page.locator('.decision-figure')).toHaveCount(2);
  await expect(page.locator('.expressive-code pre')).toHaveCount(6);
  await expect(page.locator('.hl-article-meta')).toContainText(/\d+ min read/);
  const siteMap = await request.get('/sitemap-0.xml');
  expect(await siteMap.text()).toContain(`https://theaussiepom.me${route}`);
  await page.goto('/architecture/proxmox-without-kubernetes/');
  await page.getByRole('link', { name: 'next article', exact: true }).click();
  await expect(page).toHaveURL(route);
  for (const theme of ['light', 'dark']) {
    await page.evaluate(
      (value) => localStorage.setItem('starlight-theme', value),
      theme,
    );
    for (const width of [390, 1200]) {
      await page.setViewportSize({ width, height: 900 });
      await page.reload();
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      for (const figure of await page.locator('.decision-figure').all()) {
        const fits = await figure.evaluate((element) => {
          const box = element.getBoundingClientRect();
          return (
            box.left >= 0 &&
            box.right <= innerWidth &&
            element.scrollWidth <= element.clientWidth
          );
        });
        expect(fits).toBe(true);
      }
      await page.screenshot({
        path: testInfo.outputPath(`deployment-${theme}-${width}.png`),
      });
    }
  }
  await page.getByRole('button', { name: /search/i }).click();
  await page
    .locator('.pagefind-ui__search-input')
    .fill('shared backup defaults');
  const result = page
    .locator('.pagefind-ui__result-link')
    .filter({ hasText: title })
    .first();
  await expect(result).toBeVisible();
  await result.click();
  await expect(page).toHaveURL(/\/architecture\/what-i-built-on-proxmox\//);
});
