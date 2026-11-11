# URL previews

Homepage sharing uses the approved v2.0 light Open Graph image at 1200 × 630. Its title is **The Curious Engineer**, its description comes from the homepage's existing metadata, and its Open Graph type is `website`. Theme selection never changes the sharing image. Other non-article pages use the same fallback artwork.

Published guides, architecture stories, investigations and posts receive a 1200 × 630 opaque PNG automatically. The card shows the article's title and type, with the approved black portrait on lilac, the publication name and the configured site's domain. The description belongs in metadata rather than the image. Ordinary articles need no extra frontmatter.

For articles, `og:title` and `twitter:title` use the short description, so clients that show a caption beneath the image can introduce the story instead of repeating the title already in the artwork. `og:description` and `twitter:description` carry the same summary. The article's heading, browser title, search metadata and structured-data title stay unchanged. The homepage keeps the publication name as its social title. Receiving platforms choose which fields to display; some may show both summary fields or omit a caption.

## Generation and metadata

[The static endpoint](../src/pages/og/%5Bcard%5D.png.ts) reads the validated Astro content collection and uses the shared `isPublishedArticle()` helper. It follows the existing `draft: false` publication rule; a future date is editorial metadata, not a separate scheduling mechanism. Drafts do not get cards, even in development. Published custom slugs remain authoritative for page URLs.

[The renderer](../src/lib/share-cards.mjs) measures and outlines text using the bundled Liberation Sans Bold font through OpenType.js, then uses Sharp to rasterise the SVG. Both artwork and fonts stay local. No system fonts, network fetches, image-generation API, client-side script or live rendering service are needed. The font licence remains in `brand/source/fonts/`. Website typography and the favicon are unchanged.

The [card template](../src/lib/share-card.svg) uses warm paper, ink and purple, with 72px margins and a small author signature. Titles wrap on word boundaries. Their font size adjusts from 78px to a minimum of 52px, within a bounded four-line area. Text is never clipped or shortened silently. An exceptionally long title or an unsupported glyph fails the build with a request for a shorter `share.title`.

Images are generated directly into Astro's build output at `/og/<sha256>.png`. The hash includes the rendered PNG, SVG/template, original font and original portrait. It changes when relevant rendered inputs change; editing only a description leaves the card URL stable. Image overrides are hashed too. No generated cards are committed under `public/`. Each normal production build clears its output directory, so cards for removed or unpublished articles disappear. Do not disable Astro's output cleanup or copy an old `dist/og/` directory into a new build.

[Route middleware](../src/shareRouteData.ts) waits for downstream plugin middleware before applying one final metadata set through Starlight's existing `head` data. It preserves native browser titles, useful head entries, RSS links, icons and starlight-blog's structured data. Canonical and image URLs use the configured HTTPS site origin, including `SITE_URL` for a build with another origin. The publication name comes from [the shared site settings](../src/lib/site.mjs).

Each page's initial static HTML contains one canonical link, one set of Open Graph fields and matching Twitter title, description, image and image alternative text, with `summary_large_image`. Articles use `article` and include their available publication and modification dates. Non-article pages use `website`. Legacy social fields in a page's native `head` are replaced by the final set; use the validated overrides below instead of adding competing tags.

## Optional article overrides

Keep the normal `title` and `description` as the source of truth. Use overrides only when the sharing presentation needs something different:

```yaml
share:
  title: Why I left Kubernetes out
  description: A shorter introduction for a shared link, while the article keeps its original description.
  image: /images/articles/my-approved-preview.png
  imageAlt: A diagram showing the applications and their Proxmox guests.
```

All four fields are optional. `share.title` changes the title on the card; it does not rename the article, its browser title or its route. `share.description` changes the sharing summary, including the text caption supplied through the social title fields. Without that override, the article's existing description supplies the caption. `share.imageAlt` can also customise the generated card's alternative text without supplying another image.

Custom images must be still PNG, JPEG or WebP files inside `public/`, referenced by a root-relative path. Remote URLs, traversal paths and SVG overrides are rejected. A custom image requires meaningful `imageAlt`. The build decodes it, fits the complete image into 1200 × 630 without cropping, fills any unused area with warm paper and produces an opaque PNG. Prefer preparing artwork at 1200 × 630 to use the whole card. Missing or invalid files fail the build.

The share title is limited to 180 characters, the description to 20–240 characters, and alternative text to 1–500 characters. These limits do not guarantee a title fits visually; the renderer checks its actual glyphs and geometry. Unknown override properties fail schema validation.

## Local checks

Run `npm run test:sharing` for renderer, schema and metadata checks plus two isolated Astro builds. Those builds exercise a published blog post and guide, custom title/description/image/alternative text, a custom slug, plugin ordering and another HTTPS origin. They then remove one article, unpublish the other and seed an obsolete card to verify cleanup. The authoring tree is not changed by those fixtures.

Run `npm run validate` for the complete required suite. Browser tests inspect the raw HTML responses and decode the linked PNGs, in addition to the site's existing navigation, theme and accessibility checks. Inspect the homepage image and each article's card at full size and around 300px wide. Automated geometry checks do not replace that visual review.

## After an authorised deployment

1. Fetch the public homepage and an article as plain HTML. Confirm the final titles, descriptions, canonical URL, dates, image dimensions and a single set of social tags.
2. Open the exact absolute `og:image` URL from that HTML. Check HTTPS, a successful response, `image/png`, dimensions and the complete image. Verify a removed card URL no longer resolves after output replacement.
3. Use the destination platform's preview debugger or inspection tool when available, and request a refresh if it offers one. Inspect the result without posting test messages.

Receiving platforms control their final layout, crop, whether they display a description, and how long they cache a page preview. Content-hashed images prevent reusing an old image URL, but a platform may still cache the page's earlier metadata. Local validation does not establish deployed asset availability or a receiving platform's final presentation.

The integration follows the supported [Starlight route-data middleware](https://starlight.astro.build/guides/route-data/) and [Astro static endpoints](https://docs.astro.build/en/guides/endpoints/).
