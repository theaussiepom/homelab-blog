import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import { createArticleImage } from './lib/share-cards.mjs';
import { isPublishedArticle } from './lib/editorial.mjs';
import { withShareMetadata } from './lib/share-metadata.mjs';
import { withIdentityMetadata } from './lib/identity-metadata.mjs';
import { primaryNavigation } from './lib/navigation.mjs';

export const onRequest = defineRouteMiddleware(async (context, next) => {
  // Run after plugin middleware, retaining starlight-blog's structured data and feeds.
  await next();
  const route = context.locals.starlightRoute;
  // Blog routes replace the native sidebar. Keep primary links in that same
  // sidebar while preserving the plugin's own post, tag and author navigation.
  const primary = primaryNavigation.map<(typeof route.sidebar)[number]>(
    ({ label, link }) =>
      route.sidebar.find(
        (entry) => entry.type === 'link' && entry.href === link,
      ) ?? {
        type: 'link',
        label,
        href: link,
        isCurrent: context.url.pathname === link,
        attrs: {},
        badge: undefined,
      },
  );
  route.sidebar = [
    ...primary,
    ...route.sidebar.filter(
      (entry) =>
        entry.type !== 'link' ||
        !primaryNavigation.some(({ link }) => link === entry.href),
    ),
  ];
  if (!context.site)
    throw new Error('Sharing previews require a configured site origin.');
  const data = route.entry.data;
  const image = isPublishedArticle(data)
    ? await createArticleImage(data, route.siteTitle, context.site.href)
    : undefined;
  const identityHead = withIdentityMetadata(route.head, {
    data,
    siteTitle: route.siteTitle,
    site: context.site.href,
    pathname: context.url.pathname,
  });
  route.head = withShareMetadata(identityHead, {
    data,
    siteTitle: route.siteTitle,
    pathname: context.url.pathname,
    site: context.site.href,
    image,
    lastUpdated: route.lastUpdated,
  });
});
