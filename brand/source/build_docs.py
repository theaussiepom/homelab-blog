"""Build the offline catalogue and PDF guide from the supplied production assets."""
from pathlib import Path
from html import escape
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle

OUT = Path(__file__).resolve().parents[1]
NAME = 'The Aussie Pom'
LINE = 'Software, systems and curiosity in action.'

FILES = {
'START-HERE.md': '''# The Aussie Pom | Brand suite v3.0

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
''',
'web/INTEGRATION.md': '''# The Aussie Pom | Website integration v3.0

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
''',
'web/brand.css': '''/* Example only: integrate with the existing header and root theme attribute. */
.tap-brand { display: inline-flex; align-items: center; max-inline-size: 100%; flex: 0 1 auto; }
.tap-brand img { display: block; block-size: auto; max-inline-size: 100%; max-block-size: 3.5rem; object-fit: contain; }
.tap-brand__wide { inline-size: 17rem; }
.tap-brand .tap-brand__compact { display: none; inline-size: 10rem; }
.tap-brand .tap-brand__dark { display: none; }
html[data-theme="dark"] .tap-brand .tap-brand__light { display: none; }
html[data-theme="dark"] .tap-brand .tap-brand__wide.tap-brand__dark { display: block; }
@media (max-width: 28rem) {
  .tap-brand .tap-brand__wide,
  html[data-theme="dark"] .tap-brand .tap-brand__wide.tap-brand__dark { display: none; }
  .tap-brand .tap-brand__compact.tap-brand__light { display: block; }
  html[data-theme="dark"] .tap-brand .tap-brand__compact.tap-brand__light { display: none; }
  html[data-theme="dark"] .tap-brand .tap-brand__compact.tap-brand__dark { display: block; }
}
/* Preserve the application's visible focus treatment. Never filter/invert this image. */
''',
'web/header-example.html': '''<!-- Load brand.css through the existing stylesheet pipeline. -->
<a class="tap-brand" href="/" aria-label="The Aussie Pom home">
  <img class="tap-brand__wide tap-brand__light" src="/brand/logos/svg/tap-masthead-on-light.svg?v=3" width="514" height="104" alt="" decoding="async">
  <img class="tap-brand__wide tap-brand__dark" src="/brand/logos/svg/tap-masthead-on-dark.svg?v=3" width="514" height="104" alt="" decoding="async">
  <img class="tap-brand__compact tap-brand__light" src="/brand/logos/svg/tap-compact-on-light.svg?v=3" width="653" height="208" alt="" decoding="async">
  <img class="tap-brand__compact tap-brand__dark" src="/brand/logos/svg/tap-compact-on-dark.svg?v=3" width="653" height="208" alt="" decoding="async">
</a>
''',
'web/head-snippet.html': '''<!-- Merge into the existing head component. Do not duplicate existing tags. -->
<link rel="icon" href="/brand/favicons/favicon.svg?v=3" type="image/svg+xml">
<link rel="icon" href="/brand/favicons/favicon-32x32.png?v=3" type="image/png" sizes="32x32">
<link rel="icon" href="/brand/favicons/favicon-16x16.png?v=3" type="image/png" sizes="16x16">
<link rel="shortcut icon" href="/brand/favicons/favicon.ico?v=3">
<link rel="apple-touch-icon" href="/brand/favicons/apple-touch-icon.png?v=3" sizes="180x180">
<!-- Optional: merge with the existing manifest if present. -->
<link rel="manifest" href="/brand/favicons/site.webmanifest?v=3">

<!-- Homepage values only. Articles need their own title, description, URL and image. -->
<title>The Aussie Pom</title>
<meta name="description" content="Software, systems and curiosity in action. By Ben Dennis.">
<link rel="canonical" href="https://theaussiepom.me/">
<meta property="og:type" content="website">
<meta property="og:site_name" content="The Aussie Pom">
<meta property="og:title" content="The Aussie Pom">
<meta property="og:description" content="Software, systems and curiosity in action. By Ben Dennis.">
<meta property="og:url" content="https://theaussiepom.me/">
<meta property="og:image" content="https://theaussiepom.me/brand/social/tap-opengraph-light.png">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="The Aussie Pom. Software, systems and curiosity in action. Portrait of Ben Dennis.">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="The Aussie Pom">
<meta name="twitter:description" content="Software, systems and curiosity in action. By Ben Dennis.">
<meta name="twitter:image" content="https://theaussiepom.me/brand/social/tap-opengraph-light.png">
<meta name="twitter:image:alt" content="The Aussie Pom. Software, systems and curiosity in action. Portrait of Ben Dennis.">
''',
'source/READ-ME.md': '''# Source artwork | v3.0

The native portrait geometry is carried forward unchanged from the approved suite. The name-bearing layouts and supporting line have been rebuilt for **The Aussie Pom**.

`tap-portrait-master.svg` has six named paths: hair-and-glasses, eye-right, eye-left, goatee, mouth and under-lip. `tap-micro-master.svg` uses the same paths, omitting only the two eyes. Both are tightly fitted 658 x 881 drawings. Preserve their tilt, proportions, thin frames, connected goatee and small balanced smile.

The micro favicon retains its approved optical stroke weight. It has a white circle and transparent corners. The main portrait uses black on lilac in both themes; only logo lettering changes from dark ink to warm white.

Production SVG/PDF lettering is outlined. `tap-primary-editable-text.svg` retains live text for editing. Install `fonts/LiberationSans-Bold.ttf` before editing it; application text layout may differ slightly from the outlined production assets. The font is distributed under the SIL Open Font License in `fonts/OFL-Liberation.txt`.

## Rebuilding

From a Python environment with the dependencies in `requirements.txt`:

    python3 source/build_assets.py
    python3 source/build_docs.py

The scripts locate this kit from their own path. They rebuild name-bearing artwork, brand tokens, HTML preview, documentation and the PDF guide. The approved icon, favicon and avatar exports are supplied unchanged; these scripts do not regenerate them. `build-info.json` records layout canvas sizes and measured text widths. Refresh the file manifest after rebuilding assets.

The live website remains Arial/Helvetica for headings and UI, and Georgia for reading. Bundled Liberation Sans is for logo source editing and the guide, not a request to change the site's typography.

Use SVG for new sizes instead of enlarging PNGs. Keep the original aspect ratio, flat fills and clear space. The approved raster in `reference/` is a visual reference only. All production artwork is RGB; proof separately for colour-critical printing.
''',
'source/requirements.txt': '''cairosvg>=2.9,<3
fonttools>=4,<5
reportlab>=4,<6
Pillow>=10,<14
'''
}
for path, content in FILES.items():
    (OUT/path).write_text(content)

def image(path, alt, style=''):
    return f'<img src="{path}" alt="{escape(alt)}" style="{style}">'

parts = ['''<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>The Aussie Pom | Brand suite v3</title><style>
*{box-sizing:border-box}body{margin:0;background:#FAF8F3;color:#252535;font:16px/1.55 Arial,Helvetica,sans-serif}main{max-width:1160px;margin:auto;padding:44px 28px}h1,h2{line-height:1.15;letter-spacing:-.025em}h1{font-size:44px;margin:10px 0}h2{font-size:27px;margin:44px 0 18px}p{max-width:820px}a{color:#62429A}.eyebrow{font-size:12px;font-weight:bold;color:#62429A;letter-spacing:.09em}.intro{font-size:22px;font-weight:bold}.links{display:flex;flex-wrap:wrap;gap:18px;margin:26px 0}.grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}.card{padding:24px;background:#F0ECF5;border-radius:8px}.dark{background:#1B1B27;color:#F1EEE8}.caption{font-size:13px;margin-top:18px}.note{font-size:14px;color:#625C6D}img{display:block;max-width:100%;height:auto}.favrow,.avatars{display:flex;align-items:center;gap:20px;flex-wrap:wrap}.favrow figure{margin:0;min-width:45px}.favrow figcaption{font-size:12px;margin-top:12px}.avatars img{width:140px;height:140px}.swatches{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}.swatch{height:64px;border:1px solid #DCD6E5;margin-bottom:8px}table{border-collapse:collapse;width:100%}td,th{padding:10px 0;text-align:left;border-bottom:1px solid #DCD6E5}th:first-child,td:first-child{width:90px}code{font-size:.9em}@media(max-width:700px){main{padding:28px 20px}.grid{grid-template-columns:1fr}.swatches{grid-template-columns:1fr 1fr}h1{font-size:36px}}
</style></head><body><main><div class="eyebrow">BRAND SUITE V3.0 / 12 NOVEMBER 2026</div><h1>The Aussie Pom</h1><p class="intro">Software, systems and curiosity in action.</p><p>A new name across the suite, with the approved portrait preserved. Main logos retain the black face on lilac in both themes. Browser favicons retain their white circle and transparent corners.</p><nav class="links"><a href="Brand-Guide.pdf">PDF guide</a><a href="START-HERE.md">File guide</a><a href="web/INTEGRATION.md">Integration notes</a><a href="ASSET-MANIFEST.csv">Asset inventory</a></nav><h2>Primary identity</h2><div class="grid">''']
for theme in ['light','dark']:
    parts.append(f'<div class="card {"dark" if theme=="dark" else ""}">'+image(f'logos/svg/tap-primary-on-{theme}.svg','Primary logo on '+theme,'width:100%;height:180px;object-fit:contain')+f'<div class="caption">Primary · on-{theme} · SVG / PNG / PDF</div></div>')
parts.append('</div><h2>Header at intended display size</h2><div class="grid">')
for theme in ['light','dark']:
    parts.append(f'<div class="card {"dark" if theme=="dark" else ""}">'+image(f'logos/svg/tap-masthead-on-{theme}.svg','Desktop header logo','width:272px')+'<div class="caption">272 × 55 CSS px · eyes retained</div></div>')
parts.append('</div><h2>Compact header and wordmark</h2><div class="grid"><div class="card">'+image('logos/svg/tap-compact-on-light.svg','Compact header logo','width:160px')+'<div class="caption">160 × 51 CSS px</div></div><div class="card">'+image('logos/svg/tap-wordmark-on-light.svg','Name-only wordmark','width:100%;height:70px;object-fit:contain')+'</div></div><h2>Portrait and micro portrait</h2><div class="grid">')
for kind, label in [('portrait','Main portrait · subtle eyes'),('micro','Micro portrait · eyes omitted')]:
    parts.append('<div class="card">'+image(f'icons/svg/tap-{kind}-on-light.svg',label,'width:150px;height:150px')+f'<p>{label}</p></div>')
parts.append('</div><h2>Browser favicon</h2><p>Solid white circle, transparent outside. View at 100% browser zoom to judge the labelled CSS sizes.</p><div class="grid">')
for theme in ['light','dark']:
    parts.append(f'<div class="card {"dark" if theme=="dark" else ""}"><div class="favrow">')
    for n in [16,32,48,64]:
        parts.append(f'<figure>{image(f"favicons/favicon-{n}x{n}.png",f"{n} pixel favicon",f"width:{n}px;height:{n}px")}<figcaption>{n} px</figcaption></figure>')
    parts.append('</div></div>')
parts.append('</div><p class="note">Apple touch and maskable icons are separate opaque-white home-screen assets. The browser favicon stays circular.</p><h2>Profile avatars</h2><div class="avatars">')
for suffix in ['paper','lilac','ink','circle-paper','circle-lilac','circle-ink']:
    parts.append(image(f'social/tap-avatar-{suffix}.png','Avatar '+suffix))
parts.append('</div><p>1024 × 1024 PNGs, plus SVG originals. Square avatars suit platforms that apply their own circular crop.</p>')
for title,prefix,description in [('Website banners','banners/tap-masthead','1600 × 400. Use where a wide masthead is needed.'),('Link previews','social/tap-opengraph','1200 × 630. Choose one default; article-specific previews remain separate.'),('Social covers','social/tap-social-banner','1500 × 500. Check the crop on the destination platform.'),('LinkedIn backgrounds','social/tap-linkedin-cover','1584 × 396. Text is placed away from the profile-photo overlap area.')]:
    parts.append(f'<h2>{title}</h2><div class="grid">')
    for theme in ['light','dark']:
        parts.append(image(f'{prefix}-{theme}.png',title+' '+theme,'width:100%'))
    parts.append(f'</div><p>{description}</p>')
parts.append('<h2>Palette</h2><div class="swatches">')
PALETTE=[('Paper','#FAF8F3'),('Ink','#252535'),('Accent','#62429A'),('Portrait lilac','#E2D7F5'),('Dark surface','#1B1B27'),('Warm white','#F1EEE8'),('Dark accent','#CBB5F1'),('Dark panel','#332B46')]
for name,col in PALETTE:
    parts.append(f'<div><div class="swatch" style="background:{col}"></div><small>{name}<br>{col}</small></div>')
parts.append('</div><p>Portrait ink: black (#000000). Favicon circle: white (#FFFFFF). Website fonts remain Arial/Helvetica and Georgia.</p><h2>Formats</h2><table><tr><th>Format</th><th>Use</th></tr><tr><td>SVG</td><td>Scalable web and editing assets; production lettering is outlined.</td></tr><tr><td>PNG</td><td>Social uploads, slides and raster-only applications.</td></tr><tr><td>PDF</td><td>Vector logo placement in print and layout applications.</td></tr><tr><td>ICO</td><td>Browser fallback with 16, 32 and 48 px frames.</td></tr></table><p class="note">Version 3.0 supersedes the earlier pack. Repository, website and social profiles have not been changed.</p></main></body></html>')
(OUT/'START-HERE.html').write_text(''.join(parts))

# PDF uses explicit positioning; all image aspect ratios are preserved.
for face,filename in [('Brand','LiberationSans-Regular.ttf'),('BrandBold','LiberationSans-Bold.ttf')]:
    pdfmetrics.registerFont(TTFont(face,str(OUT/'source/fonts'/filename)))
W,H=A4;M=42;CW=W-M*2
PAPER,INK,PURPLE,DARK,PALE='#FAF8F3','#252535','#62429A','#1B1B27','#F1EEE8'
c=canvas.Canvas(str(OUT/'Brand-Guide.pdf'),pagesize=A4)
c.setTitle('The Aussie Pom | Brand resource guide v3.0');c.setAuthor('The Aussie Pom')
def box(x,top,w,h,col,stroke=None):
    c.setFillColor(HexColor(col));c.setStrokeColor(HexColor(stroke or col));c.rect(x,H-top-h,w,h,fill=1,stroke=bool(stroke))
def text(t,x,top,size=11,bold=False,colour=INK):
    c.setFillColor(HexColor(colour));c.setFont('BrandBold' if bold else 'Brand',size);c.drawString(x,H-top-size,t)
def para(t,x,top,w=CW,size=10.5,colour=INK):
    p=Paragraph(t,ParagraphStyle('p',fontName='Brand',fontSize=size,leading=size*1.43,textColor=HexColor(colour)))
    _,h=p.wrap(w,1000);assert top+h<790,(top,h,t)
    p.drawOn(c,x,H-top-h);return h
def picture(rel,x,top,w,h):
    c.drawImage(str(OUT/rel),x,H-top-h,width=w,height=h,preserveAspectRatio=True,anchor='c',mask='auto')
def page(n,title):
    box(0,0,W,H,PAPER);text('THE AUSSIE POM',M,28,9,True,PURPLE);text('BRAND RESOURCE GUIDE / VERSION 3.0',M,67,9,True,PURPLE);text(title,M,86,27,True)
    c.setStrokeColor(HexColor('#DCD6E5'));c.line(M,40,W-M,40)
    text('12 November 2026 / Approved portrait retained',M,H-30,8,colour='#6F6979')
    c.setFont('Brand',8);c.drawRightString(W-M,20,str(n))
def end(): c.showPage()

page(1,'The Aussie Pom')
text(LINE,M,132,15,True,PURPLE)
para('A personal publication by Ben Dennis. The new name carries through the suite; the approved portrait and existing visual language stay consistent.',M,166)
picture('logos/png/tap-primary-on-light.png',M+8,230,CW-16,184)
box(M,454,CW,206,DARK);picture('logos/png/tap-primary-on-dark.png',M+18,470,CW-36,174)
text('ONE PORTRAIT, BOTH THEMES',M,691,10,True,PURPLE)
para('The face remains black on lilac. The lettering changes from dark ink to warm white. Header logos omit the supporting line; banners and sharing cards include it.',M,714)
end()

page(2,'Choose the right layout')
text('Primary',M,140,13,True);para('The default portrait lockup. The smaller “The” gives the shorter name room to breathe. Start around 360 px wide.',M,165,270)
picture('logos/png/tap-primary-on-light.png',M+298,139,213,86)
text('Horizontal',M,245,13,True);picture('logos/png/tap-horizontal-on-light.png',M,275,CW,102)
para('A single-line name with the portrait. Use for wider placements, starting around 400 CSS px.',M,394)
text('Website masthead',M,450,13,True);picture('logos/png/tap-masthead-on-light.png',M,481,272,55)
para('514 x 104 canvas. Display at 272 x 55 CSS px in the existing header. Keep the eyes; do not squeeze the supporting line into this logo.',M,554)
text('Compact header and wordmark',M,622,13,True)
picture('logos/png/tap-compact-on-light.png',M,654,160,51);picture('logos/png/tap-wordmark-on-light.png',M+220,654,291,51)
para('Compact: 160 x 51 CSS px. Use the name-only wordmark where the portrait already appears nearby. Preserve proportions and clear space.',M,724)
end()

page(3,'The portrait at every size')
picture('icons/png/tap-portrait-on-light.png',M,140,104,104);text('Main portrait',M+132,145,13,True)
para('Thin glasses, subtle eyes, rounded connected goatee and a balanced smile. Used in logos, headers, avatars, banners and link previews.',M+132,170,CW-132)
picture('icons/png/tap-micro-on-light.png',M,270,104,104);text('Eyeless micro portrait',M+132,275,13,True)
para('The same drawing, with only the two eyes omitted. The approved browser icon has a small optical weight adjustment for tiny sizes.',M+132,300,CW-132)
text('Browser favicon',M,412,15,True);para('Black face on a solid white circle. Everything outside the circle is transparent, so the icon remains visible on light and dark browser surfaces.',M,440)
box(M,498,CW/2-8,108,'#EEEAF3');box(M+CW/2+8,498,CW/2-8,108,DARK)
for col in range(2):
    for i,n in enumerate([16,32,48]):
        x=M+24+col*(CW/2+8)+i*66;picture(f'favicons/favicon-{n}x{n}.png',x,516+(48-n)*.375,n*.75,n*.75);text(str(n)+' px',x,566,8,colour=INK if col==0 else PALE)
para('Use START-HERE.html at 100% browser zoom for actual screen sizes. The ICO contains 16, 32 and 48 px frames; PNGs also include 64 and 96 px.',M,626)
text('Separate home-screen artwork',M,690,12,True);para('Apple touch and maskable assets are opaque white squares for platform cropping. They are not the circular browser favicon.',M,715)
end()

page(4,'Sharing and profile artwork')
text('Default link previews / 1200 x 630',M,137,12,True)
picture('social/tap-opengraph-light.png',M,167,CW/2-7,131);picture('social/tap-opengraph-dark.png',M+CW/2+7,167,CW/2-7,131)
para('Choose one homepage default. Keep article titles and article-specific images in the site’s sharing pipeline. These static images also provide a fallback.',M,318)
text('Website banner / 1600 x 400',M,379,12,True);picture('banners/tap-masthead-light.png',M,405,CW,128)
text('LinkedIn background / 1584 x 396',M,563,12,True);picture('social/tap-linkedin-cover-dark.png',M,591,CW,128)
para('Text sits away from the profile-photo overlap area. Check the crop on desktop and mobile. Generic 1500 x 500 social covers are also supplied.',M,738,size=9.5)
end()

page(5,'Colour, type and spacing')
text('Light surfaces',M,139,13,True);text('Dark surfaces',M,273,13,True)
cell=(CW-36)/4
for i,(name,col) in enumerate(PALETTE):
    x=M+(i%4)*(cell+12);top=170 if i<4 else 304;box(x,top,cell,51,col,'#DCD6E5');text(name,x,top+58,9,True);text(col,x,top+73,9)
text('Keep the portrait positive',M,421,14,True);para('Portrait ink is black (#000000). Main backing is lilac; browser-icon backing is white (#FFFFFF). White and purple name-only wordmarks are supplied. Face inversion is not part of the identity.',M,449)
text('Type and clear space',M,539,14,True);para('Website UI and headings remain Arial/Helvetica; reading text remains Georgia. Logo lettering uses outlined Liberation Sans Bold. Allow clear space of about a quarter of the portrait-circle diameter, and preserve the aspect ratio.',M,567)
text('Reproduction',M,672,14,True);para('Use flat fills. The monochrome logo has black lettering and portrait with a white circle. SVG and PDF lettering is outlined. All files use RGB; proof colour-critical print work with your printer.',M,700)
end()

page(6,'Ready for implementation')
rows=[('logos/','Primary, horizontal, masthead, compact and name-only wordmarks. SVG, transparent PNG and vector PDF.'),('icons/ and favicons/','Main and micro portraits, circular browser icons, ICO, touch and manifest assets.'),('social/ and banners/','1024 px avatars, two cover formats, homepage link previews and website mastheads.'),('web/','Integration notes, responsive header example, metadata example and colour tokens.'),('source/ and reference/','Vector masters, editable-text logo, build scripts, font and licence; approved portrait reference.')]
top=141
for path,desc in rows:
    text(path,M,top,11,True,PURPLE);para(desc,M+170,top,CW-170,10);top+=80
text('Use the supplied artwork',M,566,13,True);para('Deploy the outlined production assets. Set the exact supporting line as real homepage text. Read web/INTEGRATION.md before applying the snippets, and update references before removing old assets.',M,592)
text('Check in the application',M,673,13,True);para('Verify both themes, responsive header spacing, favicon caching, accessibility and homepage/article sharing. This is an asset handoff; the repository, website and profiles have not been modified.',M,700)
end();c.save()
print('Built catalogue, integration examples and six-page guide')
