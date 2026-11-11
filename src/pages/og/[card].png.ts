import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { site } from 'astro:config/server';
import { siteTitle } from '../../lib/site.mjs';
import { createArticleImage } from '../../lib/share-cards.mjs';
import { isPublishedArticle } from '../../lib/editorial.mjs';

export const prerender = true;
export const getStaticPaths: GetStaticPaths = async () => {
  if (!site)
    throw new Error('Sharing previews require a configured site origin.');
  const entries = await getCollection('docs', ({ data }) =>
    isPublishedArticle(data),
  );
  const images = await Promise.all(
    entries.map(({ data }) => createArticleImage(data, siteTitle, site)),
  );
  return [...new Map(images.map((image) => [image.id, image])).values()].map(
    ({ id, png }) => ({
      params: { card: id },
      props: { png },
    }),
  );
};

export const GET: APIRoute = ({ props }) =>
  new Response(new Uint8Array(props.png), {
    headers: { 'Content-Type': 'image/png' },
  });
