import { author } from './author.mjs';

export function withIdentityMetadata(
  head,
  { data, siteTitle, site, pathname },
) {
  const origin = new URL(site);
  const about = new URL(author.aboutPath, origin).href;
  const personId = `${about}#ben`;
  const websiteId = new URL('/#website', origin).href;
  const graph = [
    {
      '@type': 'WebSite',
      '@id': websiteId,
      name: siteTitle,
      url: origin.href,
      publisher: { '@id': personId },
    },
    {
      '@type': 'Person',
      '@id': personId,
      name: author.name,
      url: about,
      sameAs: [author.github, author.linkedin],
    },
  ];
  if (pathname === author.aboutPath) {
    graph.push({
      '@type': 'AboutPage',
      '@id': `${about}#webpage`,
      name: data.title,
      url: about,
      mainEntity: { '@id': personId },
      isPartOf: { '@id': websiteId },
    });
  }
  return [
    ...head.filter(
      ({ tag, attrs }) =>
        !(tag === 'meta' && attrs?.name === 'author') &&
        !(tag === 'script' && attrs?.id === 'site-identity'),
    ),
    {
      tag: 'meta',
      attrs: {
        name: 'author',
        content:
          data.authors?.map(({ name }) => name).join(', ') || author.name,
      },
    },
    {
      tag: 'script',
      attrs: { type: 'application/ld+json', id: 'site-identity' },
      content: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': graph,
      }).replace(/</g, '\\u003c'),
    },
  ];
}
