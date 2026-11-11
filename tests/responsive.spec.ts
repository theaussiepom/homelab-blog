import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage responds to available width and keeps a single story sequence', async ({
  page,
}) => {
  for (const width of [
    320, 360, 448, 449, 700, 701, 768, 799, 800, 1024, 1100, 1200, 1248, 1249,
    1440,
  ]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const geometry = await page.evaluate(() => {
      const hero = document.querySelector('.hl-hero')!;
      const card = document.querySelector('.hl-feature')!;
      const copy = document.querySelector('.hl-hero-copy')!;
      const frame = document.querySelector('.hl-home')!.getBoundingClientRect();
      return {
        split:
          card.getBoundingClientRect().left >
          copy.getBoundingClientRect().right,
        available: frame.width,
        columns: getComputedStyle(
          document.querySelector('.hl-discovery')!,
        ).gridTemplateColumns.split(' ').length,
        overflow: document.documentElement.scrollWidth > innerWidth,
        author: document.querySelector('.hl-hero-author')!.textContent!.trim(),
        order: [...hero.children]
          .filter((e) => !e.hasAttribute('aria-hidden'))
          .map((e) => e.className),
      };
    });
    expect(geometry.split, `${width}px`).toBe(
      width >= 1100 && geometry.available > 960,
    );
    expect(geometry.columns).toBe(
      width > 700 && geometry.available >= 640 ? 2 : 1,
    );
    expect(geometry.overflow, `${width}px`).toBe(false);
    expect(geometry.author).toBe('Ben Dennis');
    expect(geometry.order).toEqual(['hl-hero-copy', 'hl-feature']);
    await expect(page.locator('.hl-feature')).toHaveCount(1);
    await expect(page.locator('.hl-motif')).toHaveCount(0);
    await expect(page.locator('.hl-about-link')).toHaveAttribute(
      'href',
      '/about/',
    );
    await expect(page.locator('.hl-feature-meta')).toContainText(
      'architecture',
    );
    if (width < 800) {
      await expect(
        page.getByRole('button', { name: 'Menu', exact: true }),
      ).toBeVisible();
      await expect(page.locator('#starlight__sidebar')).toBeHidden();
    } else {
      await expect(page.locator('#starlight__sidebar')).toBeVisible();
    }
    const targets = page.locator('header button[data-open-modal]');
    const search = await targets.boundingBox();
    expect(search!.width).toBeGreaterThanOrEqual(44);
    expect(search!.height).toBeGreaterThanOrEqual(44);
    await expect(page.locator('.hl-curiosity')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    await expect(
      page.locator('.hl-curiosity svg:not([focusable="false"])'),
    ).toHaveCount(0);
  }
});

for (const theme of ['light', 'dark']) {
  test(`${theme} native menu, search and focus cooperate`, async ({ page }) => {
    await page.addInitScript(
      (value) => localStorage.setItem('starlight-theme', value),
      theme,
    );
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const sidebar = page.locator('#starlight__sidebar');
    const menu = page.getByRole('button', { name: 'Menu', exact: true });
    await menu.focus();
    await page.keyboard.press('Enter');
    await expect(sidebar).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Close', exact: true }),
    ).toBeVisible();
    await expect(
      sidebar.getByText('Appearance', { exact: true }),
    ).toBeVisible();
    await expect(
      sidebar.getByText('Find me elsewhere', { exact: true }),
    ).toBeVisible();
    await expect(sidebar.locator('.hl-social-text')).toHaveText([
      'GitHub',
      'LinkedIn',
      'RSS',
    ]);
    await sidebar.getByRole('link', { name: 'About Ben', exact: true }).focus();
    await page.keyboard.press('Escape');
    await expect(sidebar).toBeHidden();
    await expect(menu).toBeFocused();
    const search = page.getByRole('button', { name: 'Search', exact: true });
    for (const fromMenu of [false, true]) {
      if (fromMenu) await menu.click();
      await search.click();
      await expect(
        page.getByRole('dialog', { name: 'Search', exact: true }),
      ).toBeVisible();
      await expect(sidebar).toBeHidden();
      await page
        .locator('.pagefind-ui__search-input')
        .fill('settling on proxmox');
      await expect(
        page.locator('.pagefind-ui__result-link').first(),
      ).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(search).toBeFocused();
      await expect(page.locator('.main-frame')).not.toHaveAttribute('inert');
    }
    await menu.click();
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(result.violations).toEqual([]);
    await sidebar.locator('select').selectOption('auto');
    await page.emulateMedia({
      colorScheme: theme === 'light' ? 'dark' : 'light',
    });
    await expect(page.locator('html')).toHaveAttribute(
      'data-theme',
      theme === 'light' ? 'dark' : 'light',
    );
    await page.getByRole('button', { name: 'Close', exact: true }).click();
    await expect(menu).toBeFocused();
  });
}

test('a short native menu scrolls while Close and all controls stay reachable', async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 390 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  const rss = page
    .locator('.mobile-preferences')
    .getByRole('link', { name: 'RSS', exact: true });
  await rss.scrollIntoViewIfNeeded();
  await expect(rss).toBeVisible();
  const close = await page
    .getByRole('button', { name: 'Close', exact: true })
    .boundingBox();
  expect(close!.y).toBeGreaterThanOrEqual(0);
  expect(close!.y + close!.height).toBeLessThanOrEqual(390);
  await page.locator('.mobile-preferences select').scrollIntoViewIfNeeded();
  await expect(page.locator('.mobile-preferences select')).toBeVisible();
});

test('enlarged text, long titles and an extra story preserve usable reflow', async ({
  page,
}) => {
  for (const width of [320, 390, 800, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await page.evaluate(() => {
      const title = document.querySelector('.hl-feature h2 a')!;
      title.textContent = `${title.textContent}: what changed, what I learnt and why the next version needed a different approach`;
      const list = document.querySelector('.top-level details ul')!;
      const item = list.lastElementChild!.cloneNode(true) as HTMLElement;
      item.querySelector('a')!.textContent =
        'An additional published story with a longer title for navigation reflow';
      list.append(item);
      document.documentElement.style.fontSize = '200%';
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `${width}px enlarged`,
    ).toBe(true);
    const search = page.getByRole('button', { name: 'Search', exact: true });
    await expect(search).toBeVisible();
    if (width < 800) {
      await page.getByRole('button', { name: 'Menu', exact: true }).click();
      await page.locator('.mobile-preferences select').scrollIntoViewIfNeeded();
      await expect(page.locator('.mobile-preferences select')).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  }
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/architecture/what-i-built-on-proxmox/');
  await page.locator('.sl-markdown-content').evaluate((content) => {
    const text = document.createElement('p');
    text.textContent = 'https://example.test/' + 'a'.repeat(250);
    content.append(text);
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
