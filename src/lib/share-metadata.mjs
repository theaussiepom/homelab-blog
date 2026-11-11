import { fallbackImage, fallbackImageAlt } from './share-cards.mjs';
import { articleTypes } from './editorial.mjs';

const controlled =
  /^(?:og:(?:title|description|type|url|site_name|image(?::.*)?)|twitter:(?:card|title|description|image(?::.*)?)|article:(?:published_time|modified_time))$/;

// Retain native scripts, icons, feeds, locale and other useful head entries.
export function withShareMetadata(
  head,
  { data, siteTitle, pathname, site, image, lastUpdated },
) {
  const origin = new URL(site);
  if (
    origin.protocol !== 'https:' ||
    origin.pathname !== '/' ||
    origin.search ||
    origin.hash
  ) {
    throw new Error(
      'Share metadata requires the configured HTTPS site origin.',
    );
  }
  const article = articleTypes.includes(data.articleType);
  const title =
    pathname === '/' ? siteTitle : (data.share?.title ?? data.title);
  const description =
    data.share?.description ??
    data.description ??
    head.find(
      ({ tag, attrs }) => tag === 'meta' && attrs?.name === 'description',
    )?.attrs?.content;
  const canonical = new URL(pathname, origin).href;
  const shareImage = image ?? {
    path: fallbackImage,
    alt: fallbackImageAlt,
    type: 'image/png',
    width: 1200,
    height: 630,
  };
  const imageUrl = new URL(shareImage.path, origin).href;
  const values = {
    'og:title': title,
    'og:description': description,
    'og:type': article ? 'article' : 'website',
    'og:url': canonical,
    'og:site_name': siteTitle,
    'og:image': imageUrl,
    'og:image:type': shareImage.type,
    'og:image:width': String(shareImage.width),
    'og:image:height': String(shareImage.height),
    'og:image:alt': shareImage.alt,
    'twitter:card': 'summary_large_image',
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': imageUrl,
    'twitter:image:alt': shareImage.alt,
    ...(article && data.date instanceof Date
      ? { 'article:published_time': data.date.toISOString() }
      : {}),
    ...(article && lastUpdated instanceof Date
      ? { 'article:modified_time': lastUpdated.toISOString() }
      : {}),
  };
  if (!description)
    throw new Error(`Missing share description for ${pathname}`);
  return [
    ...head.filter(
      ({ tag, attrs }) =>
        !(
          tag === 'meta' &&
          (controlled.test(attrs?.property ?? '') ||
            controlled.test(attrs?.name ?? ''))
        ) && !(tag === 'link' && attrs?.rel === 'canonical'),
    ),
    { tag: 'link', attrs: { rel: 'canonical', href: canonical } },
    ...Object.entries(values).map(([key, content]) => ({
      tag: 'meta',
      attrs: {
        [key.startsWith('twitter:') ? 'name' : 'property']: key,
        content,
      },
    })),
  ];
}
