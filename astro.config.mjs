import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import starlight from '@astrojs/starlight';
import starlightBlog from 'starlight-blog';
import { articleReadingTime } from './src/lib/reading-time.mjs';
import {
  siteTitle,
  siteDescription,
  siteOrigin,
  brandAsset,
} from './src/lib/site.mjs';
import { author } from './src/lib/author.mjs';
import { primaryNavigation } from './src/lib/navigation.mjs';

const site = process.env.SITE_URL || siteOrigin;
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
      favicon: brandAsset('favicons/favicon.ico'),
      customCss: ['./src/styles/hybrid.css'],
      components: {
        Hero: './src/components/HomeHero.astro',
        SiteTitle: './src/components/SiteTitle.astro',
        PageTitle: './src/components/ArticleTitle.astro',
        Footer: './src/components/ArticleFooter.astro',
        Sidebar: './src/components/ArticleSidebar.astro',
        PageSidebar: './src/components/ArticlePageSidebar.astro',
        SocialIcons: './src/components/SocialIcons.astro',
        MobileMenuToggle: './src/components/MobileMenuToggle.astro',
        MobileMenuFooter: './src/components/MobileMenuFooter.astro',
      },
      description: siteDescription,
      defaultLocale: 'root',
      locales: { root: { label: 'English (Australia)', lang: 'en-AU' } },
      social: [
        {
          icon: 'github',
          label: `${author.name} on GitHub`,
          href: author.github,
        },
        {
          icon: 'linkedin',
          label: `${author.name} on LinkedIn`,
          href: author.linkedin,
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
            href: brandAsset('favicons/favicon-32x32.png'),
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'icon',
            type: 'image/svg+xml',
            sizes: 'any',
            href: brandAsset('favicons/favicon.svg'),
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'apple-touch-icon',
            sizes: '180x180',
            href: brandAsset('favicons/apple-touch-icon.png'),
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'manifest',
            href: brandAsset('favicons/site.webmanifest'),
          },
        },
      ],
      sidebar: [
        ...primaryNavigation,
        {
          label: 'Stories',
          items: [{ autogenerate: { directory: 'architecture' } }],
        },
      ],
      plugins: [
        starlightBlog({
          title: 'Notes',
          navigation: 'none',
        }),
      ],
    }),
  ],
});
