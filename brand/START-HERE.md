# The Curious Engineer | Brand suite v2.0

Approved portrait revision, 11 November 2026.

Extract the whole ZIP, then open **START-HERE.html** for the visual preview or **Brand-Guide.pdf** for the usage guide.

## What changed

The entire suite now uses the approved portrait with a rounded connected goatee, thinner glasses, subtle eyes and a smaller, balanced smile. The favicon uses the same drawing without eyes. The rejected pointed beard and white inverted portraits are no longer included.

**The face stays black in both themes.** Main logos use a soft lilac circle. Only the wordmark changes from dark ink on light backgrounds to warm white on dark backgrounds. Browser favicons retain a solid white circle with transparent corners.

This package replaces v1.0. When integrating it, replace the old brand asset folder rather than merging in obsolete files. The repository and website have not been changed by this work.

## Start with these files

| Placement | File |
| --- | --- |
| Primary logo on light | `logos/svg/tce-primary-on-light.svg` |
| Primary logo on dark | `logos/svg/tce-primary-on-dark.svg` |
| Website header | `logos/svg/tce-masthead-on-light.svg` and `tce-masthead-on-dark.svg` |
| Compact two-line name | `logos/svg/tce-compact-on-light.svg` and `tce-compact-on-dark.svg` |
| Name only | `logos/svg/tce-wordmark-on-light.svg` and `tce-wordmark-on-dark.svg` |
| Browser favicon | `favicons/favicon.svg`, with the PNG and ICO fallbacks |
| Social profile on dark | `social/tce-avatar-ink.png` |
| Social profile on lilac | `social/tce-avatar-lilac.png` |
| Website banner | `banners/tce-masthead-light.png` or `tce-masthead-dark.png` |
| Social cover | `social/tce-social-banner-light.png` or `tce-social-banner-dark.png` |
| Link preview | `social/tce-opengraph-light.png` or `tce-opengraph-dark.png` |

## Folder guide

- **logos/**: SVG, transparent PNG and vector PDF. Primary, horizontal, masthead and compact layouts each have on-light, on-dark and black variants. The black variant uses a white circle for monochrome reproduction. Name-only wordmarks also include purple and white.
- **icons/**: main portrait with eyes and micro portrait without eyes. Bare black artwork is transparent. On-dark versions have lilac backing for the main face and white backing for the micro face. There are no inverted faces.
- **favicons/**: SVG; 16, 32, 48, 64 and 96 px PNGs; ICO containing 16/32/48 px frames; Apple touch, web-manifest icons and an optional manifest. Browser-icon strokes have a small weight adjustment to remain visible at tiny sizes.
- **social/**: 1024 px avatars, 1500 × 500 covers and 1200 × 630 link previews, with SVG originals.
- **banners/**: 1600 × 400 mastheads in SVG and PNG.
- **source/**: vector masters, live-text primary logo, font and licence. The portrait master has six named paths; the micro master uses the same paths with the two eyes omitted.
- **reference/**: the approved portrait image. This is a reference, not the asset to deploy.
- **web/**: integration guidance, HTML/CSS examples and colour tokens.
- **ASSET-MANIFEST.csv**: file inventory, dimensions, sizes and SHA-256 checksums; excludes itself.

## Format and colour notes

Production SVG and PDF lettering is outlined. No font installation is required to display it. The editable text source uses the included Liberation Sans Bold, a metrically compatible alternative to Arial. The website continues to use Arial/Helvetica for UI and headings, and Georgia for reading.

All production artwork uses flat RGB colours. SVG is preferred for web and editing, PNG for uploads, and PDF for vector placement in print layouts. Obtain a printer-specific proof for colour-critical print work.

The browser favicon has transparent corners. Apple touch and maskable home-screen icons are separate opaque-white square assets for platform cropping. Those squares are not the browser favicon.
