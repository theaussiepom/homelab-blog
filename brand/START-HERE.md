# The Aussie Pom | Brand suite v3.0

12 November 2026

**Software, systems and curiosity in action.**

Extract the complete ZIP and open **START-HERE.html** for the visual catalogue. **Brand-Guide.pdf** explains the artwork and how to use it. For implementation, start with **web/INTEGRATION.md**.

## What changed

The publication name and all name-bearing artwork now read **The Aussie Pom**. The approved portrait is preserved, including its rounded goatee, thin glasses, subtle eyes and balanced smile. The supporting line appears on banners, covers and sharing cards. Header logos remain uncluttered.

The main portrait stays black on lilac in both themes; only the lettering changes to warm white on dark surfaces. The favicon stays eyeless, black on a solid white circle, transparent outside the circle. Name-free portrait and favicon PNGs are carried forward unchanged.

This package supersedes the earlier brand suite. This is an asset handoff; the repository, live website and social profiles have not been changed.

## Start with these files

| Placement | Recommended files |
| --- | --- |
| Primary logo | `logos/svg/tap-primary-on-light.svg` and `tap-primary-on-dark.svg` |
| Desktop website header | `logos/svg/tap-masthead-on-light.svg` and `tap-masthead-on-dark.svg` |
| Compact website header | `logos/svg/tap-compact-on-light.svg` and `tap-compact-on-dark.svg` |
| Name without portrait | `logos/svg/tap-wordmark-on-light.svg` and `tap-wordmark-on-dark.svg` |
| Browser favicon | `favicons/favicon.svg` plus supplied PNG and ICO fallbacks |
| Social profile | `social/tap-avatar-lilac.png` or `tap-avatar-ink.png` |
| Website banner | `banners/tap-masthead-light.png` or `tap-masthead-dark.png` |
| Generic social cover | `social/tap-social-banner-light.png` or `tap-social-banner-dark.png` |
| LinkedIn background | `social/tap-linkedin-cover-light.png` or `tap-linkedin-cover-dark.png` |
| Default link preview | `social/tap-opengraph-light.png` or `tap-opengraph-dark.png` |

## Folder guide

- **logos/**: SVG, transparent PNG and vector PDF. Primary, horizontal, masthead and compact layouts each have light-surface, dark-surface and monochrome variants. Name-only wordmarks also include white and purple.
- **icons/**: main portrait with eyes and eyeless micro portrait, in SVG and PNG. Bare artwork and backed versions are supplied.
- **favicons/**: SVG; 16, 32, 48, 64 and 96 px PNGs; ICO with 16/32/48 px frames; touch and web-manifest icons; optional manifest.
- **social/**: 1024 px avatars, 1500 x 500 generic covers, 1584 x 396 LinkedIn covers and 1200 x 630 link previews, with SVG originals.
- **banners/**: 1600 x 400 website mastheads in SVG and PNG.
- **source/**: approved vector masters, editable-text primary logo, build scripts, font and licence.
- **reference/**: approved portrait image, for reference rather than deployment.
- **web/**: integration guidance, HTML/CSS examples and colour tokens.
- **ASSET-MANIFEST.csv**: file dimensions, byte sizes and SHA-256 checksums, excluding the manifest itself.

## Formats

Use SVG for scalable website artwork, PNG for uploads, and PDF for vector placement in print/layout software. Production lettering is outlined, so no font installation is needed. The live-text source uses the bundled Liberation Sans Bold. Website UI/headings remain Arial/Helvetica; reading text remains Georgia.

Artwork uses flat RGB colours. For colour-critical print, obtain a printer-specific proof. Browser favicons have transparent corners; Apple touch and maskable icons are separate opaque white squares for platform cropping.
