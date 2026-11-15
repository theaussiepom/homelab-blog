import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { isPublishedArticle } from '../../lib/editorial.mjs';
import { siteTitle, siteDescription } from '../../lib/site.mjs';

export const prerender = true;

export const GET: APIRoute = async ({ site }) => {
  if (!site) throw new Error('RSS requires a configured site origin.');
  const articles = (
    await getCollection('docs', ({ data }) => isPublishedArticle(data))
  ).sort(
    (a, b) =>
      (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0) ||
      a.id.localeCompare(b.id),
  );
  return rss({
    title: siteTitle,
    description: siteDescription,
    site,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: `<language>en-AU</language><atom:link href="${new URL('/blog/rss.xml', site).href}" rel="self" type="application/rss+xml"/>`,
    items: articles.map(({ id, data }) => ({
      title: data.title,
      description: data.description,
      pubDate: data.date,
      link: new URL(`/${id}/`, site).href,
      categories: data.tags,
    })),
  });
};
