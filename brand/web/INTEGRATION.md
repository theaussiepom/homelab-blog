# The Aussie Pom | Website integration v3.0

This pack supplies assets and examples. Integrate with the existing application and approved style guide; the snippets have not been installed in the live site.

## Identity

- Publication: **The Aussie Pom**
- Supporting line, exactly: **Software, systems and curiosity in action.**
- Author: **Ben Dennis**
- Website: https://theaussiepom.me/
- Personal GitHub: https://github.com/theaussiepom
- LinkedIn: https://www.linkedin.com/in/theaussiepom/

The portrait is unchanged. Use the new name-bearing files consistently across the header, footer, metadata, RSS/channel metadata, manifest and default sharing images. Keep article URLs and content intact. Update relevant brand documentation alongside implementation.

## Asset paths and header

The examples assume `public/brand/`, preserving the supplied subfolders, with public URLs beginning `/brand/`. Update all references before removing obsolete files. Do not replace unrelated article images or generated article-sharing images. If paths differ, update the snippets and manifest together.

Use `tap-masthead-on-light.svg` and `tap-masthead-on-dark.svg` for the desktop header. The canvas is 514 x 104. At **272 CSS px** wide it is approximately **55 px** high, fitting the existing 80 px header with its 56 px inner content area. Recheck with the actual navigation.

At narrow widths, the sample switches to `tap-compact-on-light.svg` and `tap-compact-on-dark.svg`. This 653 x 208 canvas displays at **160 x 51 CSS px**. Adjust the breakpoint to the site's navigation, with no horizontal overflow at 320 px viewport width.

The header portrait retains its eyes. Both theme variants contain the same black face on lilac. Only the lettering changes. Do not invert the entire image or recolour the face. Keep the site's existing theme mechanism. The sample CSS responds to the root `data-theme` attribute and does not introduce a second theme system.

The home link has one accessible name and its logo images use empty alt text. Give a standalone logo image meaningful alt text. Preserve visible keyboard focus and existing navigation semantics. `brand.css` is an isolated component example, not a replacement stylesheet.

## Supporting line and personal links

Place the supporting line as real text in the homepage introduction. Do not shrink it into the header logo. Preserve the approved page layout, typography, colours and existing headline treatment. The supplied banners are assets for suitable wide placements, not an instruction to replace the homepage hero with an image.

Display GitHub and LinkedIn with equal visual weight alongside the existing RSS link, using the same site colour and icon sizing. Each icon-only link needs its own accessible name. The GitHub destination is the personal account above. Reuse the existing RSS URL and mobile navigation.

## Favicons and home-screen icons

The browser favicon is black on a solid white circle, transparent outside the circle, with the eyes omitted. Its approved optical weight is retained for tiny sizes. It needs no dark-mode inversion. The PNG and ICO exports are unchanged from the approved pack.

- `favicon.svg`: scalable browser icon.
- `favicon-16x16.png`, `32x32`, `48x48`, `64x64`, `96x96`: raster sizes.
- `favicon.ico`: 16, 32 and 48 px frames.
- `apple-touch-icon.png`: opaque white 180 px square.
- `icon-192.png` / `icon-512.png`: white circle with transparent corners.
- `icon-maskable-512.png`: opaque white square, with portrait detail inside the central 40%-radius safe circle.

Merge the optional manifest into any existing one. It declares normal browser display mode and icons, without adding installation prompts, a service worker or offline features. The sample uses a version query for favicon/header cache refresh; use the application's own asset-versioning approach where available.

## Link previews and covers

The two 1200 x 630 Open Graph PNGs are alternatives. A sharing service will not choose one based on the viewer's website theme. Choose one default for homepage sharing; the light version is the sample default.

Merge `head-snippet.html` into the existing metadata component. Emit one set of tags per page. Use absolute HTTPS image and canonical URLs. Keep article-specific titles, descriptions, URLs, article metadata and generated preview images. An article should use its own preview when available and this default only as a fallback. A normal browser favicon is independent of the large sharing image.

The supplied SVGs are editable templates, not a dynamic article image generator. Update any existing article-image generator's branding and typography through the site's normal implementation. Preserve prominent article titles rather than substituting the homepage card for every article.

The 1500 x 500 covers are generic wide artwork. LinkedIn backgrounds have separate **1584 x 396** PNG/SVG files, with essential text away from the lower-left profile-photo area. Check the crop after uploading on desktop and mobile. The LinkedIn cover omits a second portrait because the profile photo already supplies it.

LinkedIn sizing reference: https://www.linkedin.com/help/linkedin/answer/a568217/

## Before shipping

Check both themes at desktop, tablet and 320 px mobile width; logo height, navigation spacing, image proportions, keyboard focus and accessible names. Confirm favicon requests and inspect 16/32 px renderings at normal zoom. Check homepage and article metadata in rendered HTML, absolute image URLs and sharing crops. Existing social-preview caches may need refreshing through the destination service's tools.

No repository, website or profile changes were made while producing this pack.
