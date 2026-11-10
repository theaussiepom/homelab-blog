import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = [
  '/',
  '/start-here/',
  '/guides/',
  '/guides/placeholder/',
  '/guides/editorial-workflow-example/',
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

for (const theme of ['light', 'dark']) {
  for (const path of pages) {
    test(`${theme} palette is accessible: ${path}`, async ({ page }) => {
      await page.addInitScript(
        (value) => localStorage.setItem('starlight-theme', value),
        theme,
      );
      await page.goto(path);
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
            .analyze()
        ).violations,
      ).toEqual([]);
    });
  }
  test(`${theme} reflows at mobile, tablet and desktop widths`, async ({
    page,
  }) => {
    await page.addInitScript(
      (value) => localStorage.setItem('starlight-theme', value),
      theme,
    );
    for (const width of [320, 390, 700, 768, 1024, 1200, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const path of ['/', '/guides/placeholder/', '/blog/']) {
        await page.goto(path);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          `${path} at ${width}px`,
        ).toBe(true);
      }
    }
  });
}

test('theme choice persists and auto follows the system', async ({ page }) => {
  await page.goto('/');
  const select = page.locator('starlight-theme-select select').first();
  await select.selectOption('dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('link', { name: /Explore the sample guide/ }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await select.selectOption('light');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.emulateMedia({ colorScheme: 'dark' });
  await select.selectOption('auto');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('mobile homepage exposes theme selection', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto('/');
  const select = page.locator('starlight-theme-select select').first();
  await expect(select).toBeVisible();
  await select.selectOption('dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await select.selectOption('light');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('Australian English blog labels are translated', async ({ page }) => {
  for (const path of ['/blog/', '/blog/foundation-placeholder/']) {
    await page.goto(path);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en-AU');
    await expect(page.locator('body')).not.toContainText('starlightBlog.');
    await expect(page.getByText('All posts', { exact: true })).toBeVisible();
  }
});

test('keyboard access and enlarged text preserve reading and navigation', async ({
  page,
}) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: /skip to content/i }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: /search/i }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: /search/i })).toBeFocused();
  await page.goto('/guides/placeholder/');
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '200%';
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('.expressive-code')).toBeVisible();
});

test('drafts have no production routes, discovery pages or search entries', async ({
  page,
  request,
}) => {
  for (const path of [
    '/guides/editorial-draft-canary/',
    '/blog/editorial-draft-canary/',
    '/blog/tags/draft-canary/',
    '/blog/authors/draft-canary-author/',
  ]) {
    expect((await request.get(path)).status(), path).toBe(404);
  }
  await page.goto('/');
  const results = await page.evaluate(async () => {
    // Await exact-phrase searches: unquoted Pagefind queries can return fuzzy matches.
    // @ts-expect-error Pagefind is generated by the production build.
    const search = await import('/pagefind/pagefind.js');
    return Promise.all(
      ['editorialdraftcanaryguides', 'editorialdraftcanaryblog'].map(
        async (term) => (await search.search(`"${term}"`)).results.length,
      ),
    );
  });
  expect(results).toEqual([0, 0]);
});

test('article introduction exposes shared metadata in both themes', async ({
  page,
}) => {
  for (const theme of ['light', 'dark']) {
    await page.goto('/guides/placeholder/');
    await page
      .locator('starlight-theme-select select')
      .first()
      .selectOption(theme);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('.hl-lede')).toContainText('Synthetic content');
    await expect(page.locator('.hl-article-meta')).toContainText(
      'HomeLab Notes',
    );
    await expect(page.locator('.hl-article-meta time')).toHaveAttribute(
      'datetime',
      '2026-11-10',
    );
  }
});

test('published editorial example is discoverable and renders native steps', async ({
  page,
  request,
}) => {
  await page.goto('/guides/editorial-workflow-example/');
  await expect(page.locator('h1')).toHaveText(
    'Synthetic example — checking a sample response',
  );
  await expect(page.locator('.hl-draft')).toHaveCount(0);
  await expect(page.locator('.sl-steps')).toBeVisible();
  await expect(page.locator('.hl-article-meta')).toContainText(
    'synthetic-example',
  );
  const sitemap = await request.get('/sitemap-0.xml');
  expect(await sitemap.text()).toContain('/guides/editorial-workflow-example/');
  await page.getByRole('button', { name: /search/i }).click();
  await page
    .locator('.pagefind-ui__search-input')
    .fill('editorialpublishedlighthouse');
  await expect(page.locator('.pagefind-ui__result-link').first()).toContainText(
    'Synthetic example',
  );
  await page.locator('.pagefind-ui__result-link').first().click();
  await expect(page).toHaveURL(/guides\/editorial-workflow-example/);
});
