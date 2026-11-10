import { test, expect } from '@playwright/test';

const origin = 'https://theaussiepom.me';
const article = '/architecture/homelab-proxmox-journey/';

test('landing pages have no comment widget; local previews do not load Giscus', async ({
  page,
}) => {
  const thirdPartyRequests: string[] = [];
  page.on('request', (request) => {
    if (request.url().startsWith('https://giscus.app/')) {
      thirdPartyRequests.push(request.url());
    }
  });
  for (const path of ['/', '/architecture/', '/blog/']) {
    await page.goto(path);
    await expect(page.locator('.hl-comments')).toHaveCount(0);
  }
  await page.goto(article);
  await expect(page.locator('.hl-comments-status')).toHaveText(
    'Comments are available on the public site.',
  );
  await expect(
    page.getByRole('link', { name: 'browse the discussions on GitHub' }),
  ).toHaveAttribute(
    'href',
    /homelab-blog\/discussions\/categories\/announcements$/,
  );
  expect(thirdPartyRequests).toEqual([]);
});

test('public article loads its comments near the footer and follows theme changes', async ({
  page,
  request,
}) => {
  // Serve our local build under its public origin without touching the live site.
  await page.route(`${origin}/**`, async (route) => {
    const url = new URL(route.request().url());
    const response = await request.get(url.pathname + url.search);
    await route.fulfill({ response });
  });
  await page.route('https://giscus.app/client.js', (route) =>
    route.fulfill({
      contentType: 'application/javascript',
      body: `
        const config = document.currentScript.dataset;
        const iframe = document.createElement('iframe');
        iframe.className = 'giscus-frame';
        iframe.title = 'Comments';
        iframe.src = 'https://giscus.app/test-frame?theme=' + config.theme;
        document.currentScript.parentElement.append(iframe);
      `,
    }),
  );
  await page.route('https://giscus.app/test-frame?*', (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: `<html><body><p id="theme"></p><script>
        const label = document.querySelector('#theme');
        label.textContent = new URL(location.href).searchParams.get('theme');
        window.addEventListener('message', event => {
          if (event.origin === '${origin}' && event.data?.giscus?.setConfig) {
            label.textContent = event.data.giscus.setConfig.theme;
          }
        });
      </script></body></html>`,
    }),
  );
  await page.addInitScript(() =>
    localStorage.setItem('starlight-theme', 'light'),
  );
  await page.goto(origin + article);
  await expect(
    page.locator('script[src="https://giscus.app/client.js"]'),
  ).toHaveCount(0);
  await page.locator('.hl-comments').scrollIntoViewIfNeeded();
  const client = page.locator('script[src="https://giscus.app/client.js"]');
  await expect(client).toHaveAttribute(
    'data-repo',
    'theaussiepom/homelab-blog',
  );
  await expect(client).toHaveAttribute('data-mapping', 'pathname');
  await expect(client).toHaveAttribute('data-strict', '1');
  const frame = page.frameLocator('iframe.giscus-frame');
  await expect(frame.locator('#theme')).toHaveText('light');
  await page
    .locator('starlight-theme-select select')
    .first()
    .selectOption('dark');
  await expect(frame.locator('#theme')).toHaveText('dark_dimmed');
  await page
    .locator('starlight-theme-select select')
    .first()
    .selectOption('light');
  await expect(frame.locator('#theme')).toHaveText('light');
});

test('a blocked comment script leaves a working GitHub alternative', async ({
  page,
  request,
}) => {
  await page.route(`${origin}/**`, async (route) => {
    const url = new URL(route.request().url());
    await route.fulfill({
      response: await request.get(url.pathname + url.search),
    });
  });
  await page.route('https://giscus.app/client.js', (route) => route.abort());
  await page.goto(origin + article);
  await page.locator('.hl-comments').scrollIntoViewIfNeeded();
  await expect(page.getByRole('status')).toHaveText(/Comments couldn’t load/);
  await expect(
    page.getByRole('link', { name: 'browse the discussions on GitHub' }),
  ).toBeVisible();
});
