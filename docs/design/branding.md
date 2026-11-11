# The Curious Engineer: brand identity

Version 2.0 | 11 November 2026

Use the supplied portrait identity with the existing warm paper, ink and purple palette. The [visual style guide](style-guide.md) controls page layout and reading typography; the [voice guide](../editorial/voice.md) controls the writing. This Markdown defines how the identity is used in the site.

## Artwork and authority

`brand/` is the single authoritative kit. Update it in place when artwork is approved; do not keep numbered, versioned or historical kit folders in the repository or public assets. `public/brand/` is only the selected runtime export of that same kit, verified byte for byte against its originals.

The complete supplied v2.0 suite lives in [brand/](../../brand/START-HERE.md), including vector masters, PNG and PDF exports, social artwork, the original usage guide and the source font licence. Preserve its 118 files byte for byte against [ASSET-MANIFEST.csv](../../brand/ASSET-MANIFEST.csv). The manifest is a separate file. The original PDF is an archived brand resource, not a second maintained edition of the layout guide.

Production SVG lettering is outlined. It needs no installed font, font service or browser font download. The bundled Liberation Sans Bold and its SIL Open Font License belong with the editable source. Website headings and controls continue to use Arial/Helvetica; long-form reading continues to use Georgia.

Use the approved portrait with its rounded connected goatee, thin glasses, subtle eyes and small smile. The face stays black in both themes, on the supplied soft lilac circle. Only the wordmark changes from dark ink on light surfaces to warm white on dark surfaces. Do not invert the image or apply colour filters. The black monochrome lockup uses a white circle; white and purple variants are available for the name-only wordmark, never the face.

Keep the supplied aspect ratios and head tilt. Leave clear space around the artwork, approximately a quarter of the portrait circle's diameter. Avoid shadows, glow, gradients, stretching or additional technology symbols in the identity.

## Choosing artwork

| Placement                                 | Required treatment                                                                                  |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Shared website header                     | Approved portrait with eyes; masthead or compact lockup according to available width.               |
| Larger logo, introduction or presentation | Full-portrait primary or horizontal lockup.                                                         |
| Avatar                                    | Supplied full-portrait square or circular avatar.                                                   |
| Browser favicon                           | Black micro portrait without eyes, on a solid white circle with transparent corners in both themes. |
| Apple touch icon                          | Separate opaque-white 180 px square.                                                                |
| Maskable icon                             | Separate opaque-white 512 px square with the portrait inside its safe circle.                       |
| Homepage and fallback link preview        | Supplied 1200 × 630 light PNG, independent of the reader's selected theme.                          |
| Published article link preview            | Generated editorial card with the article title, type and a small approved portrait on lilac.       |
| Author biography                          | The author's approved photograph and supplied biography. The logo does not replace the photograph.  |

The approved portrait under `brand/reference/` is a visual reference. Use the standalone production assets for the site. The main portrait retains its eyes; the micro portrait omits only the two eye paths, with a slight stroke-weight adjustment in the browser favicon for small sizes. Keep the larger banners and alternate print/social formats available in the archive; add them to the public asset set when a concrete placement needs them.

## Header and themes

[SiteTitle.astro](../../src/components/SiteTitle.astro) supplies one home link whose accessible name comes from Starlight's configured site title. The images are decorative within that named link. Show the on-light or on-dark artwork according to Starlight's existing `data-theme` value, including system-following Auto mode. Do not add another theme switcher or colour-scheme store.

The existing header remains 80 px tall. Use the 644 × 104 masthead at up to 312 CSS pixels wide. At 448 px and narrower, use the 745 × 240 compact lockup at 160 CSS pixels wide. Both fit the header's approximately 56 px content height. Preserve intrinsic dimensions, scale proportionally and keep search and Menu usable at 320 px. The compact layout keeps the lettering readable without squeezing a single line beside the controls.

Print uses the on-light artwork. Images outside a named decorative link need appropriate alternative text, such as “The Curious Engineer”.

## Icons and sharing metadata

Runtime files live under `public/brand/`, preserving the suite's subfolders. The matching files in `brand/` are their originals. `public/favicon.svg` retains the previous favicon URL with the new supplied artwork. Header and head-metadata asset URLs carry `?v=2` so clients request the revised files rather than reusing an earlier version at the same URL. This does not alter the archived bytes or guarantee refresh of an external sharing platform's cache.

[Astro configuration](../../astro.config.mjs) selects the ICO fallback, SVG and 32 px PNG favicons, Apple touch icon and the single manifest. The manifest references the separate web and maskable icons and keeps ordinary browser display mode. It does not introduce a service worker or offline application.

Use an absolute public URL for sharing images, derived from the configured site origin. The light Open Graph image is the homepage image and site-wide fallback. The dark version is available as an alternative artwork asset; sharing platforms do not select it from the reader's theme. Published articles receive a 1200 × 630 opaque editorial card with their title as the dominant element, a small article-type label, the approved portrait on lilac, the publication name and domain. Use generous margins, bold Liberation Sans lettering and the warm paper/ink/purple palette. Keep the description in metadata. Do not add technology imagery or a large decorative logo.

The [URL preview guide](../sharing-previews.md) defines automatic generation, content-hashed paths, text-fit checks and validated `share` overrides. Article artwork carries the title; the article's short description supplies the social text caption beneath it. Starlight route middleware supplies a final, non-duplicated metadata set after plugin middleware; native page titles, descriptions, canonical routes, feeds and structured data retain their roles. Use `share` fields rather than competing social tags in native `head` frontmatter.

## Updating and checking

Replace the archive and runtime asset directories from an updated suite rather than merging obsolete artwork into them. Keep the manifest, public copies, intrinsic dimensions and documentation consistent. Retired pointed-beard and inverted-face assets must not remain alongside the approved suite. Do not run formatters over supplied artwork, manifests, font files or original guidance. Those directories are excluded from Prettier so their original checksums remain useful.

Run `npm run test:brand` to verify the archived checksums, reject unlisted archive files and check the public copies. It is included in `npm run validate`. Check the header visually in both themes at mobile and desktop widths, confirm keyboard focus and the link's accessible name, and verify that icons and manifest assets load. Check sharing metadata on an article as well as the homepage. Destination-platform social crops and browser icon caches require their own live checks after deployment.
