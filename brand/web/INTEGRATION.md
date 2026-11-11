# Website integration | v2.0

This is an asset handoff. No repository or website changes have been applied.

## Replace the old assets

Use `public/brand/` as the suggested destination, keeping the chosen subfolders. Public URLs then start with `/brand/`. Replace the old brand asset directory so retired white portraits and the old pointed-beard favicon do not remain in use. If using a different base path, update the snippets and manifest together.

## Header

The header logo uses the approved portrait **with eyes**. Use `tce-masthead-on-light.svg` and `tce-masthead-on-dark.svg`. Both contain the same black face on lilac; only the lettering changes. Do not apply CSS `invert()` or a colour filter to the image.

The masthead canvas is 644 × 104. Start with a width of 280–320 CSS px in the site's existing 80 px header, then check the actual navigation and mobile layout. At 320 px wide its height is 51.7 px. The compact two-line logo is an alternative for a narrower placement. Other canvas dimensions are recorded in the asset manifest.

The supplied example swaps images using the existing root `data-theme="light"` / `data-theme="dark"` attribute. The link has one accessible name; the images inside it have empty alt text. For an independent logo image, use meaningful alt text such as `The Curious Engineer`.

Keep the current site typography, sidebar, layout and colour system. `brand.css` only supplies an isolated starting point for the logo component; it is not a replacement stylesheet.

## Browser favicon and home-screen icons

The browser favicon uses the approved face **without eyes**, black ink on a solid white circle, and transparency outside the circle. The SVG, PNG and ICO versions share that treatment. A slight stroke-weight adjustment keeps the spectacle rims and mouth visible at tiny sizes. No dark-mode recolouring is required.

`apple-touch-icon.png` is an opaque white 180 px square. `icon-192.png` and `icon-512.png` are white-circle icons with transparent corners. `icon-maskable-512.png` is an opaque white square with all portrait detail within the central 40%-radius safe circle. These icons also omit the eyes.

The optional manifest defines ordinary browser display mode and icon metadata. It adds no service worker or offline functionality. Merge with any existing manifest rather than adding a second one.

## Social sharing

Use a 1200 × 630 PNG as the default link-preview image. The example assumes the absolute URL `https://theaussiepom.me/brand/social/tce-opengraph-light.png`. Keep article-specific titles, descriptions and canonical URLs. Article-specific images can override the default.

Light and dark link-preview images are alternatives; the sharing platform does not choose them based on a reader's site theme. Generic 1500 × 500 covers may need a platform-specific crop.

## Check after integration

Check desktop and mobile headers, both themes, keyboard focus and accessible naming. Verify the new icon URL is requested, because browsers may cache old favicons. Inspect the 16 and 32 px icon at normal zoom, and preview social crops on the destination platform. The supplied snippets have not been installed or exercised in the live application.

## References

- Existing repository: `theaussiepom/homelab-blog`, `docs/design/style-guide.md` v1.5 and `docs/editorial/voice.md` v1.1, reviewed 11 November 2026.
- [MDN: Define your app icons](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Define_app_icons).
- [web.dev: Maskable icons](https://web.dev/articles/maskable-icon).
- [Apple: Configuring Web Applications](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html), archived Apple touch-icon guidance.
