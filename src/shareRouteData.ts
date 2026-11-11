import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import { createArticleImage } from './lib/share-cards.mjs';
import { isPublishedArticle } from './lib/editorial.mjs';
import { withShareMetadata } from './lib/share-metadata.mjs';

export const onRequest = defineRouteMiddleware(async (context, next) => {
  // Run after plugin middleware, retaining starlight-blog's structured data and feeds.
  await next();
  const route = context.locals.starlightRoute;
  if (!context.site)
    throw new Error('Sharing previews require a configured site origin.');
  const data = route.entry.data;
  const image = isPublishedArticle(data)
    ? await createArticleImage(data, route.siteTitle, context.site.href)
    : undefined;
  route.head = withShareMetadata(route.head, {
    data,
    siteTitle: route.siteTitle,
    pathname: context.url.pathname,
    site: context.site.href,
    image,
    lastUpdated: route.lastUpdated,
  });
});
