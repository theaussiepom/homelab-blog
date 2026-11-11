import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import starlight from '@astrojs/starlight';
import starlightBlog from 'starlight-blog';
import { articleReadingTime } from './src/lib/reading-time.mjs';
import { siteTitle } from './src/lib/site.mjs';

const site = process.env.SITE_URL || 'https://theaussiepom.me';
const url = new URL(site);
if (
  url.protocol !== 'https:' ||
  url.pathname !== '/' ||
  url.search ||
  url.hash
) {
  throw new Error(
    'SITE_URL must be an HTTPS origin without a path, query or fragment.',
  );
}
export default defineConfig({
  site: url.origin,
  output: 'static',
  trailingSlash: 'always',
  markdown: {
    processor: satteri({ mdastPlugins: [articleReadingTime] }),
  },
  integrations: [
    starlight({
      title: siteTitle,
      routeMiddleware: './src/shareRouteData.ts',
      favicon: '/brand/favicons/favicon.ico?v=2',
      customCss: ['./src/styles/hybrid.css'],
      components: {
        Hero: './src/components/HomeHero.astro',
        SiteTitle: './src/components/SiteTitle.astro',
        PageTitle: './src/components/ArticleTitle.astro',
        Footer: './src/components/ArticleFooter.astro',
        Sidebar: './src/components/ArticleSidebar.astro',
        PageSidebar: './src/components/ArticlePageSidebar.astro',
      },
      description:
        'Practical guides, architecture stories and investigations from a curious homelab.',
      defaultLocale: 'root',
      locales: { root: { label: 'English (Australia)', lang: 'en-AU' } },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/theaussiepom',
        },
      ],
      head: [
        { tag: 'meta', attrs: { name: 'robots', content: 'index,follow' } },
        {
          tag: 'link',
          attrs: {
            rel: 'icon',
            type: 'image/png',
            sizes: '32x32',
            href: '/brand/favicons/favicon-32x32.png?v=2',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'icon',
            type: 'image/svg+xml',
            sizes: 'any',
            href: '/brand/favicons/favicon.svg?v=2',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'apple-touch-icon',
            sizes: '180x180',
            href: '/brand/favicons/apple-touch-icon.png?v=2',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'manifest',
            href: '/brand/favicons/site.webmanifest?v=2',
          },
        },
      ],
      sidebar: [
        { label: 'Home', link: '/' },
        {
          label: 'Stories',
          items: [{ autogenerate: { directory: 'architecture' } }],
        },
      ],
      plugins: [
        starlightBlog({
          title: siteTitle,
          description: 'Shorter notes from Ben’s homelab.',
          navigation: 'none',
        }),
      ],
    }),
  ],
});
