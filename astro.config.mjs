import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightBlog from 'starlight-blog';

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
  integrations: [
    starlight({
      title: 'HomeLab Notes',
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
          href: 'https://github.com/theaussiepom/homelab-blog',
        },
      ],
      head: [
        { tag: 'meta', attrs: { name: 'robots', content: 'index,follow' } },
      ],
      sidebar: [
        {
          label: 'Start Here',
          items: [{ autogenerate: { directory: 'start-here' } }],
        },
        {
          label: 'Architecture',
          items: [{ autogenerate: { directory: 'architecture' } }],
        },
      ],
      plugins: [
        starlightBlog({
          title: 'HomeLab Blog',
          description: 'Shorter notes from HomeLab Notes.',
          navigation: 'none',
        }),
      ],
    }),
  ],
});
