# The Aussie Pom: brand identity

Version 3.0 | 12 November 2026

Use the supplied identity with the established warm paper, ink and purple palette. The [visual style guide](style-guide.md) controls layout and typography; the [voice guide](../editorial/voice.md) controls the writing.

## Identity and ownership

| Item                | Required value                             |
| ------------------- | ------------------------------------------ |
| Publication         | The Aussie Pom                             |
| Author display name | Ben Dennis                                 |
| Supporting line     | Software, systems and curiosity in action. |
| Homepage headline   | There’s always one more thing to build.    |
| Website             | https://theaussiepom.me/                   |
| GitHub              | https://github.com/theaussiepom            |
| LinkedIn            | https://www.linkedin.com/in/theaussiepom/  |

[Site settings](../../src/lib/site.mjs) own the publication name, origin, description, supporting line and asset cache version. [Author data](../../src/lib/author.mjs) owns Ben’s display name, biography and profile links. Preserve `Ben` as the existing source attribution key; the content schema resolves it to Ben Dennis and the About URL for display and native blog metadata. Unknown contributors retain their own attribution.

Keep the domain, repository ownership, article paths and canonical URLs. The supporting line belongs in the homepage introduction as readable text with natural wrapping. Keep it out of the shared masthead and article titles. The homepage retains its personal introduction and featured story, with an About Ben link near the introduction.

## One authoritative kit

`brand/` is the single authoritative kit. Its [manifest](../../brand/ASSET-MANIFEST.csv) identifies all 127 supplied originals, including usage guidance, production exports, editable masters, build scripts and licensed fonts. The manifest itself is separate. `public/brand/` contains only the 18 selected runtime exports, verified byte for byte against those originals. Do not keep competing numbered, versioned or historical kit directories in the repository.

Distribute the complete kit as **The-Aussie-Pom-Brand-Suite.zip**, with its manifest and editable sources. The supplied PDF is archived brand guidance; the Markdown visual guide remains the website layout specification. Preserve supplied files against their checksums. Refresh the manifest deliberately if future approved artwork is rebuilt, and verify dimensions as well as bytes.

Production SVG/PDF lettering is outlined. Logo editing and sharing-card rendering use bundled Liberation Sans Bold with its font licence. The website retains Arial/Helvetica for headings and controls and Georgia for reading. Do not add a font service or replace the website typography with the logo font.

## Portrait, palette and themes

Preserve the approved geometry, head tilt, rounded connected goatee, thin glasses, subtle eyes and balanced smile. Do not redraw, regenerate, stretch or filter the face. It stays black on the supplied lilac circle in both themes. Only the wordmark lettering changes from ink to warm white for dark surfaces. The monochrome black lockup uses a white circle.

Use paper `#FAF8F3`, ink `#252535`, purple `#62429A` and lilac `#E2D7F5`, with the visual guide’s dark-mode roles. Preserve aspect ratios and clear space. Avoid shadows, glow, gradients or extra technology symbols in the identity.

The main portrait and author photograph have separate roles. Use the supplied illustrated portrait in the identity and share-card signature. Use the approved photograph for the About page and article biography.

## Header, navigation and profiles

[SiteTitle.astro](../../src/components/SiteTitle.astro) provides one home link with the publication’s accessible name and decorative images. Use `tap-masthead-on-light.svg` and `tap-masthead-on-dark.svg`, with intrinsic dimensions 514 × 104. Display at 272 CSS pixels wide, approximately 55 pixels high inside the existing 80-pixel header. At 448 pixels and narrower, use the 653 × 208 compact lockup at 160 pixels wide. Keep search, Menu and focus rings usable at 320 pixels.

Follow the native Light/Dark/Auto mechanism. Do not add another theme store. Print uses the on-light artwork. A standalone logo needs meaningful alternative text; the decorative image within the named home link uses empty alternative text.

Order social controls GitHub, LinkedIn, RSS. Use equal optical sizing, the site’s colours, 44-pixel interaction targets, descriptive accessible names and useful hover labels. Preserve the native separator from theme selection and the existing mobile-menu placement. The blog plugin supplies the RSS destination automatically; do not add a duplicate feed link. GitHub points to Ben’s personal profile.

Add About Ben to the existing global navigation, separate from technical stories. The About page uses the established reading layout, the author photograph and clearly labelled profile links. Article cards retain their compact design and photograph, with “About Ben Dennis”, a 40–60 word biography, a link to the full About page and separate GitHub and LinkedIn links. Do not duplicate that card on the homepage or About page.

## Icons and previews

The favicon is the eyeless micro portrait in black on a solid white circle, transparent outside the circle. Preserve its optical stroke weight. Apple touch uses an opaque white 180-pixel square; the maskable icon has its separately specified white background and safe area. Do not invert these in dark mode. The supplied manifest keeps browser display mode without adding a service worker, installation prompt or offline behaviour.

The `brandAsset()` helper adds the shared cache version to header, icon, manifest and fallback-preview references. Keep intrinsic dimensions, paths and checksums consistent when changing assets. `public/favicon.svg` preserves the earlier favicon URL as an alias of the supplied new SVG.

The fixed homepage/fallback preview is `social/tap-opengraph-light.png`, 1200 × 630. Sharing services do not select its theme from the viewer’s website preference. Published article previews retain the existing generated editorial template: dominant article title, small category label, black portrait on lilac, publication name and domain. Follow [URL previews](../sharing-previews.md) for hashing, overrides, draft exclusion and caption metadata.

## Validation and maintenance

Run `npm run validate` and the source-safety checks. `npm run test:brand` verifies original checksums, rejects unlisted assets or competing kit folders, decodes declared image dimensions and compares runtime exports with their originals. Check the replacement ZIP against the same manifest and files.

Inspect homepage, About and an article at desktop and narrow mobile widths, in both themes. Check masthead geometry, keyboard focus, mobile navigation, author links, sharing cards, 16/32-pixel icons and Auto theme behaviour. Receiving platforms control final preview layout and caching; local checks do not establish their presentation.

Reciprocal links from Ben’s GitHub and LinkedIn profiles to the website are a separate follow-up. Do not change external profile settings while integrating the site identity.
