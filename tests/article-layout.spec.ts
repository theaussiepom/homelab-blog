import { test, expect } from '@playwright/test';

const article = '/architecture/homelab-proxmox-journey/';

for (const theme of ['light', 'dark']) {
  test(`${theme} articles use left contents and preserve site browsing`, async ({
    page,
  }) => {
    await page.addInitScript(
      (value) => localStorage.setItem('starlight-theme', value),
      theme,
    );
    for (const width of [800, 1024, 1152, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(article);
      const sidebar = page.locator('.hl-reader-sidebar');
      await expect(sidebar.locator('starlight-toc')).toBeVisible();
      await expect(page.locator('.right-sidebar-container')).toBeHidden();
      await expect(page.locator('.hl-site-links')).not.toHaveAttribute('open');
      const geometry = await page.evaluate(() => {
        const sidebar = document
          .querySelector('.hl-reader-sidebar')!
          .getBoundingClientRect();
        const title = document
          .querySelector('main h1')!
          .getBoundingClientRect();
        const column = document
          .querySelector('main .sl-container')!
          .getBoundingClientRect();
        return {
          left: sidebar.right <= title.left,
          width: column.width,
          overflow: document.documentElement.scrollWidth > innerWidth,
        };
      });
      expect(geometry.left).toBe(true);
      expect(geometry.width).toBeLessThanOrEqual(701);
      expect(geometry.overflow).toBe(false);
      const links = sidebar.locator('starlight-toc a');
      const targets = await links.evaluateAll((items) =>
        items.map((link) => (link as HTMLAnchorElement).hash),
      );
      for (const target of targets) {
        await expect(page.locator(target)).toHaveCount(1);
      }
      // A middle section has enough content below it to reach the scrollspy band.
      await links.nth(2).click();
      await expect(links.nth(2)).toHaveAttribute('aria-current', 'true');
      await links.last().click();
      await expect(page).toHaveURL(new RegExp(`${targets.at(-1)}$`));
      // At the page bottom a heading may not reach that band. Anchor navigation
      // must still work and the native TOC must retain exactly one current item.
      await expect(
        sidebar.locator('starlight-toc a[aria-current="true"]'),
      ).toHaveCount(1);
      await sidebar.locator('.hl-site-links > summary').click();
      await expect(
        sidebar.getByRole('link', { name: 'Home', exact: true }).first(),
      ).toBeVisible();
    }
  });

  test(`${theme} mobile articles expose usable contents and a separate site menu`, async ({
    page,
  }) => {
    await page.addInitScript(
      (value) => localStorage.setItem('starlight-theme', value),
      theme,
    );
    for (const width of [320, 390, 799]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(article);
      const contents = page.locator('.hl-mobile-contents');
      const summary = contents.locator('summary');
      await expect(summary).toBeVisible();
      const title = await page.locator('main h1').boundingBox();
      const bar = await summary.boundingBox();
      expect(title!.y).toBeGreaterThanOrEqual(bar!.y + bar!.height);
      await summary.click();
      const last = contents.locator('a').last();
      const target = await last.getAttribute('href');
      await last.click();
      await expect(page.locator('#starlight__mobile-toc')).not.toHaveAttribute(
        'open',
      );
      await expect(page).toHaveURL(new RegExp(`${target}$`));
      await page.getByRole('button', { name: 'Menu', exact: true }).click();
      await page.locator('.hl-site-links > summary').click();
      const siteLink = page
        .locator('#starlight__sidebar')
        .getByRole('link', { name: 'Home', exact: true })
        .first();
      await expect(siteLink).toBeVisible();
      await siteLink.click();
      await expect(page).toHaveURL('/');
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  });
}

test('landing and archive pages retain their normal navigation', async ({
  page,
}) => {
  for (const path of ['/', '/blog/']) {
    await page.goto(path);
    await expect(page.locator('.hl-reader-sidebar')).toHaveCount(0);
    await expect(page.locator('.hl-mobile-contents')).toHaveCount(0);
  }
});

test('the shared bio follows the story and precedes comments for its author', async ({
  page,
}) => {
  const bio = page.getByRole('region', { name: 'About Ben' });
  for (const path of ['/', '/blog/']) {
    await page.goto(path);
    await expect(bio).toHaveCount(0);
  }

  await page.goto(article);
  await expect(bio.getByRole('heading', { level: 2 })).toHaveText('About Ben');
  await expect(
    bio.getByRole('link', { name: 'GitHub · @theaussiepom', exact: true }),
  ).toHaveAttribute('href', 'https://github.com/theaussiepom');
  await expect(
    page.getByRole('link', { name: 'GitHub', exact: true }),
  ).toHaveAttribute('href', 'https://github.com/theaussiepom');
  await expect(
    bio.getByRole('img', { name: 'Ben at the beach' }),
  ).toBeVisible();
  await expect(bio.locator('p')).toHaveCount(2);
  const order = await bio.evaluate((card) => {
    const story = document.querySelector('main .sl-markdown-content');
    const comments = card.nextElementSibling;
    return {
      followsStory:
        story !== null &&
        Boolean(
          story.compareDocumentPosition(card) &
          Node.DOCUMENT_POSITION_FOLLOWING,
        ),
      precedesComments:
        comments?.getAttribute('aria-labelledby') === 'comments-heading',
    };
  });
  expect(order).toEqual({ followsStory: true, precedesComments: true });
});
