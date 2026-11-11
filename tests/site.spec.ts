import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const story = '/architecture/homelab-proxmox-journey/';
const storyTitle = 'From a NAS VM to Proxmox: five versions of my homelab';
const retiredPages = ['/start-here/', '/architecture/'];
const samples = [
  '/guides/',
  '/guides/placeholder/',
  '/guides/editorial-workflow-example/',
  '/investigations/',
  '/blog/foundation-placeholder/',
  '/blog/tags/placeholder/',
  '/blog/authors/homelab-notes/',
];
const pages = [
  '/',
  story,
  '/architecture/proxmox-without-kubernetes/',
  '/blog/',
];
for (const path of pages) {
  test(`renders accessibly: ${path}`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    if (path === '/blog/') {
      await expect(page.getByText('All posts', { exact: true })).toBeVisible();
    } else {
      await expect(page.locator('h1')).toBeVisible();
    }
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
test('homepage uses the shared sidebar and links directly to published stories', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1200, height: 900 });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-has-sidebar', '');
  const sidebar = page.locator('#starlight__sidebar');
  await expect(sidebar).toBeVisible();
  await expect(
    sidebar.getByRole('link', { name: 'Home', exact: true }),
  ).toHaveAttribute('href', '/');
  await expect(
    sidebar.getByRole('link', { name: storyTitle, exact: true }),
  ).toHaveAttribute('href', story);
  await expect(
    sidebar.getByRole('link', {
      name: 'Why I chose not to use Kubernetes inside Proxmox',
      exact: true,
    }),
  ).toHaveAttribute('href', '/architecture/proxmox-without-kubernetes/');
  await expect(page.locator('.hl-topics')).toHaveCount(0);
  await expect(page.locator('.hl-brand')).toHaveText('The Curious Engineer');
  await expect(page).toHaveTitle('Home | The Curious Engineer');
  await expect(page.locator('.hl-brand small')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.locator('.hl-discovery a')).toHaveCount(1);
  for (const path of retiredPages) {
    await expect(page.locator(`a[href="${path}"]`)).toHaveCount(0);
  }
  await page.screenshot({
    path: testInfo.outputPath('homepage.png'),
    fullPage: true,
  });
});

test('search returns the published homelab story', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /search/i }).click();
  await page.locator('.pagefind-ui__search-input').fill('settling on proxmox');
  const result = page
    .locator('.pagefind-ui__result-link')
    .filter({ hasText: storyTitle })
    .first();
  await expect(result).toBeVisible();
  await result.click();
  await expect(page).toHaveURL(story);
});

test('the story has a table of contents and metadata', async ({ page }) => {
  await page.goto(story);
  await expect(page.locator('starlight-toc').first()).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://theaussiepom.me' + story,
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    /garage door/,
  );
});
test('mobile navigation and layout', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: /menu/i }).click();
  // Starlight's nav wrapper uses display: contents; test the native popover and usable link.
  await expect(page.locator('#starlight__sidebar')).toBeVisible();
  await page
    .locator('#starlight__sidebar')
    .getByRole('link', {
      name: storyTitle,
      exact: true,
    })
    .click();
  await expect(page).toHaveURL(story);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
test('the sitemap and feed omit unpublished samples', async ({ request }) => {
  const rss = await request.get('/blog/rss.xml');
  expect(rss.status()).toBe(200);
  const rssBody = await rss.text();
  expect(rssBody).toContain('<rss');
  const index = await request.get('/sitemap-index.xml');
  expect(index.status()).toBe(200);
  expect(await index.text()).toContain('sitemap-0.xml');
  const sitemap = await request.get('/sitemap-0.xml');
  const sitemapBody = await sitemap.text();
  expect(sitemapBody).toContain(story);
  for (const path of samples) {
    expect(sitemapBody).not.toContain(path);
    expect(rssBody).not.toContain(path);
  }
  // Retire the exact landing URLs; published stories keep their /architecture/ paths.
  for (const path of retiredPages) {
    expect(sitemapBody).not.toContain(
      `<loc>https://theaussiepom.me${path}</loc>`,
    );
    expect(rssBody).not.toContain(
      `<link>https://theaussiepom.me${path}</link>`,
    );
  }
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
      for (const path of ['/', story, '/blog/']) {
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
  await page.getByRole('link', { name: 'Read the homelab story' }).click();
  await expect(page).toHaveURL(/architecture\/homelab-proxmox-journey/);
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

test('mobile homepage menu exposes navigation and theme selection', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  const select = page.locator(
    '#starlight__sidebar starlight-theme-select select',
  );
  await expect(select).toBeVisible();
  await select.selectOption('dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await select.selectOption('light');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('Australian English blog labels are translated', async ({ page }) => {
  await page.goto('/blog/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-AU');
  await expect(page.locator('body')).not.toContainText('starlightBlog.');
  await expect(page.getByText('All posts', { exact: true })).toBeVisible();
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
  await page.goto(story);
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '200%';
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('.article-screenshot').first()).toBeVisible();
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
    ...samples,
    ...retiredPages,
  ]) {
    expect((await request.get(path)).status(), path).toBe(404);
  }
  await page.goto('/');
  const results = await page.evaluate(async () => {
    // Await exact-phrase searches: unquoted Pagefind queries can return fuzzy matches.
    // @ts-expect-error Pagefind is generated by the production build.
    const search = await import('/pagefind/pagefind.js');
    return Promise.all(
      [
        'editorialdraftcanaryguides',
        'editorialdraftcanaryblog',
        'editorialpublishedlighthouse',
        'synthetic publishing lighthouse',
      ].map(async (term) => (await search.search(`"${term}"`)).results.length),
    );
  });
  expect(results).toEqual([0, 0, 0, 0]);
});

test('article introduction exposes shared metadata in both themes', async ({
  page,
}) => {
  for (const theme of ['light', 'dark']) {
    for (const path of [story, '/architecture/proxmox-without-kubernetes/']) {
      await page.goto(path);
      await page
        .locator('starlight-theme-select select')
        .first()
        .selectOption(theme);
      await expect(page.locator('h1')).toHaveCount(1);
      if (path === story) {
        await expect(page.locator('.hl-lede')).toContainText('garage door');
      }
      await expect(page.locator('.hl-article-meta')).toContainText('Ben');
      await expect(page.locator('.hl-reading-time')).toContainText(
        'Estimated reading time',
      );
      await expect(page.locator('.hl-reading-time dd')).toHaveText(
        /^[1-9]\d* min read$/,
      );
      await expect(page.locator('.hl-article-meta time')).toHaveAttribute(
        'datetime',
        '2026-11-11',
      );
    }
  }
});

test('public navigation links to published pages', async ({ page }) => {
  for (const path of [
    '/',
    story,
    '/architecture/proxmox-without-kubernetes/',
  ]) {
    await page.goto(path);
    for (const sample of [...samples, ...retiredPages, '/blog/']) {
      await expect(page.locator(`a[href="${sample}"]`)).toHaveCount(0);
    }
  }
});

test('the deployment figure loads with a full-size link', async ({
  page,
  request,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(story);
  const image = page.getByRole('img', {
    name: /GitHub Actions workflow graph/,
  });
  await image.scrollIntoViewIfNeeded();
  expect(
    await image.evaluate(async (element: HTMLImageElement) => {
      await element.decode();
      return element.naturalWidth;
    }),
  ).toBeGreaterThan(0);
  const link = page.getByRole('link', {
    name: 'View the workflow at full size',
  });
  const href = await link.getAttribute('href');
  expect(href).toMatch(/github-actions-deploy.*\.png$/);
  const fullSize = await request.get(href!);
  expect(fullSize.ok()).toBe(true);
  expect(fullSize.headers()['content-type']).toContain('image/png');
});
