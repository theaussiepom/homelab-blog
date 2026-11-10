# HomeLab Notes: visual style and layout guide

Version 1.1 | 10 November 2026 | Approved design direction: 04 + 05 hybrid

## 1. Direction and authority

The chosen direction combines the Technical magazine's confident homepage with the Quiet personal publication's warm, comfortable reading experience. Use this guide for future layout, typography, colour and component work. The Markdown is the canonical specification; the accompanying PDF is its printable edition.

The approved direction is implemented in the Astro/Starlight theme. These rules describe its shared visual language and the intentional adaptations to the native publishing shell. Reference images use synthetic content. Article wording, diagrams and dates in them are examples, not editorial requirements.

Keep the bold sans-serif masthead, dark opening panel and lilac featured article. Use warm paper surfaces and serif text for article summaries and extended reading. Carry purple accents consistently from discovery into the article. The homepage may be expressive; the article should give the text room to breathe.

![Approved hybrid homepage reference](assets/hybrid-home.png)

The reference image shows the visual intent. The numeric rules below take precedence where they deliberately improve the prototype, especially small labels, code size, tablet layout and mobile navigation. Dark mode is specified below. Final branding and full editorial templates remain separate decisions.

<!-- pagebreak -->

## 2. Typography

Use local system fonts. No external font service or font download is required. Test fallback rendering because font availability and metrics vary by operating system.

| Role                                              | Font stack                                                           | Weight                                    |
| ------------------------------------------------- | -------------------------------------------------------------------- | ----------------------------------------- |
| Brand, display headings, navigation, labels       | Arial, Helvetica, sans-serif                                         | 700 for emphasis; 400 for supporting text |
| Article body, lede, section headings, card titles | Georgia, 'Times New Roman', serif                                    | 400; 700 for inline emphasis              |
| Code, commands, identifiers                       | ui-monospace, SFMono-Regular, Consolas, 'Liberation Mono', monospace | 400                                       |

### Type specimens

> Display / Arial: Small systems. Big understanding.

> Reading / Georgia: A practical way to understand the system.

> Code / monospace: curl --head https://service.example.test

Use genuine available weights. Arial commonly provides regular and bold; use 700 rather than relying on a synthetic 800 weight. Keep the expressive homepage headline in sans-serif and the featured article's title in serif.

| Element                | Desktop size / line height | Mobile size / line height            |
| ---------------------- | -------------------------- | ------------------------------------ |
| Masthead               | 29px / 1.15                | 25px / 1.15                          |
| Homepage headline      | 60px / 1.03                | 36-45px / 1.03                       |
| Article title          | 48px / 1.08                | 32px / 1.08                          |
| Featured article title | 33px / 1.15                | 29px / 1.15                          |
| Article lede           | 23px / 1.45                | 22px / 1.50                          |
| Article body           | 18px / 1.70                | 18px / 1.70                          |
| Article H2 / H3        | 29px / 1.25; 23px / 1.30   | 29px / native heading rhythm; 23px   |
| Discovery card title   | 25px / 1.20                | 25px / 1.20                          |
| UI and navigation      | 14-16px / 1.50             | 14-16px / 1.50                       |
| Labels and metadata    | 12px / 1.50 minimum        | 12px / 1.50 minimum                  |
| Code / table text      | 14px / 1.70; 16px / 1.50   | Same sizes; contain overflow locally |

Implement sizes in rem, based on the user's default font size; do not lock the root font size. Use fluid sizing between these anchors. The lede is a future editorial component; current placeholder prose uses the body style. Preserve the native heading spacing and code line-height where the framework supplies them. Keep body text left-aligned and avoid justified columns. Target 60-75 characters per line, with the article width capped at 700px.

Use at most -0.04em tracking for display headings and -0.02em for serif titles. Body text uses normal tracking. Short uppercase labels may use 0.10em tracking; never use uppercase for paragraphs. Give paragraphs 1em separation and H2 sections about 2em above / 0.6em below. Essential labels and commands must remain legible at 200% zoom.

<!-- pagebreak -->

## 3. Colour system

Use semantic roles rather than scattering literal colours through component CSS. The light theme uses warm paper and a dark homepage panel. The dark theme uses an ink reading surface and muted violet panels. The hero retains its fixed dark surface in both modes.

| Token               | Value   | Intended use                               |
| ------------------- | ------- | ------------------------------------------ |
| --hl-paper          | #FAF8F3 | Page and article background                |
| --hl-ink            | #252535 | Primary text (hero uses fixed ink)         |
| --hl-accent         | #62429A | Links, labels, active navigation and focus |
| --hl-feature        | #E2D7F5 | Featured article background                |
| --hl-on-dark        | #FFFFFF | Display headings on dark surfaces          |
| --hl-inverse-body   | #EEEAF3 | Body text on dark surfaces                 |
| --hl-inverse-accent | #DFD0FA | Links and labels on dark surfaces          |
| --hl-callout        | #F0EBF5 | Informational callout background           |
| --hl-rule           | #BEB9B1 | Decorative section separators              |
| --hl-rule-soft      | #D0CBC3 | Decorative column dividers                 |
| --hl-diagram-paper  | #F4F0E9 | Diagram node background                    |

Use ink for body text and the framework's contrast-tested grey scale for supporting UI; establish hierarchy with size, weight and spacing instead of low-opacity text. The two rule colours are decorative only. Use the accent or ink for a boundary that is necessary to recognise an input, button or selected state.

### Measured text contrast

These ratios are calculated from the listed solid sRGB colours, rounded to two decimals. They validate colour pairs, not the accessibility of the finished website. Require at least 4.5:1 for normal text and 3:1 for essential control boundaries and indicators.

| Pair                | Contrast |
| ------------------- | -------- |
| Ink on paper        | 14.19:1  |
| Accent on paper     | 7.16:1   |
| Ink on lilac        | 10.95:1  |
| Accent on lilac     | 5.52:1   |
| White on ink        | 15.06:1  |
| Inverse body on ink | 12.69:1  |
| Accent on callout   | 6.48:1   |

Underline links within prose. Pair status colours with text or an icon and a label. Use a 3px accent focus outline with a 3px offset on light surfaces, and the inverse accent on dark surfaces. Verify the actual adjacent colours during implementation. Success, warning and error palettes are not approved here; preserve accessible framework treatments until separately reviewed.

<!-- pagebreak -->

## Dark-mode reference

The following semantic overrides belong to the same hybrid design. Keep display hierarchy, spacing and typography identical across modes. Do not use a blanket colour inversion.

| Token          | Value   | Intended use                     |
| -------------- | ------- | -------------------------------- |
| --hl-paper     | #1B1B27 | Page and article background      |
| --hl-ink       | #F1EEE8 | Primary reading text             |
| --hl-accent    | #CBB5F1 | Links, active controls and focus |
| --hl-feature   | #332B46 | Featured article panel           |
| --hl-callout   | #2A2539 | Notes, diagrams and inline code  |
| --hl-rule      | #615A6D | Decorative section separators    |
| --hl-rule-soft | #484252 | Decorative dividers              |

The fixed hero remains #252535 with white headings, #EEEAF3 body text and #DFD0FA labels. The feature card uses the theme-dependent panel, text and accent roles. Native search, sidebar, contents, menus and code blocks follow the same selected theme. Warning, danger and tip treatments retain their native semantic colours.

Light, Dark and Auto must remain usable on desktop and mobile. In Auto, changing the operating system preference updates the page. Explicit choices persist through navigation and reloads. Keep focus indicators visible on both page and panel surfaces. Inspect syntax highlighting and controls after framework updates.

<!-- pagebreak -->

## 4. Homepage layout and responsive rules

### Desktop: 1100px and wider

Use a centred homepage content wrapper with a maximum width of 1160px. Native Starlight outer gutters surround it; the hero adds 42px internal side padding. The header is at least 102px tall and may grow with content. Place the masthead at left, native search in the middle and theme/social controls at right. Put the five topic links in a wrapping row above the hero. Preserve access to Start Here, Guides, Architecture, Investigations, Blog and search; the prototype's reduced navigation is not a reason to drop production features.

The hero spans the wrapper's full width. Use two columns with a 1.18:1 ratio, a 46px gap and 34px vertical padding. Align the introduction and featured article near their vertical centres. The left column contains a short context label, a strong headline and a concise personal introduction. Limit the introduction to about 455px. Avoid fixed heights or manual line breaks that fail at intermediate widths.

The lilac feature uses 24-28px padding, one representative diagram or image, a serif article title, a short summary, metadata and a clear reading link. Its image should support the subject. Abstract graphics in the reference are placeholders, not a permanent brand asset.

Below the hero, show an understated section label and a three-column discovery row. Use 24-32px gaps or internal padding, serif card titles and short summaries. Avoid enclosing every item in a heavy card. Surface topic categories and a route to the archive as content grows.

### Tablet: 701-1099px

Use the native outer gutters and 28px internal hero padding. The native header changes at 800px; keep the homepage theme control visible below that width. Stack the hero by default; a two-column hero is permitted only if both columns remain readable and test content fits. Discovery rows may use two columns, with the remaining item taking a natural next row. Do not shrink text to preserve a desktop composition.

### Mobile: up to 700px

Use native outer gutters and 22px internal hero side padding. Stack the hero and discovery content. Use 28px hero vertical padding, 20px feature padding and about 26px between the introduction and feature. The homepage has visible wrapping topic links, search and a theme selector, so it needs no menu drawer. Documentation and blog pages retain the native labelled Menu button and sidebar. On mobile the homepage header is 132px tall to accommodate the theme selector.

### Shared spacing and geometry

Use a 4px spacing scale: 4, 8, 12, 16, 20, 24, 28, 32, 40, 48 and 64px. The approved 22px gutter, 34px hero padding and 46px hero gap are documented composition exceptions. Use square or subtly rounded corners, 0-4px. Use thin rules and colour blocks for structure; shadows are not the default. Prefer content-driven heights.

<!-- pagebreak -->

## 5. Article layout

![Approved hybrid article reference](assets/hybrid-article.png)

Cap the reading column at 700px inside Starlight's native article shell. Retain its 240px section sidebar from 800px and right-hand contents column from 1152px; below those widths use its native collapsible navigation and contents controls. These production breakpoints deliberately replace the prototype's 930px region and 1100px contents breakpoint, preserving keyboard and responsive behaviour.

For future editorial templates, order the page as category, title, lede, author/date/reading time, any required notice, and article content. Current documentation uses the native title and body; blog pages retain plugin metadata without inventing authors or reading information. Use a single H1 followed by a logical heading hierarchy. Keep paragraphs and diagrams in the reading column. Wide tables or code may scroll within their own container, never force horizontal scrolling of the page.

Use sans-serif for the title, metadata and navigation; serif for the lede, body and section headings. The desktop title is 48px, the body is 18px with 1.7 line height. Mobile retains the body size. The table of contents may be sticky if it stays inside the viewport and does not obscure focus or headings.

The reference screenshot is a top-of-article excerpt. Real articles must preserve useful navigation through the full page, including previous/next or related content where appropriate. Long titles, multiple authors, absent imagery and long code lines must all fit without changing the design's basic rules.

<!-- pagebreak -->

## 6. Components and interaction

| Component             | Required treatment                                                                                                                                              |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Links                 | Accent on light surfaces; inverse accent on dark. Underline prose links. Hover may strengthen the underline; focus must remain explicit.                        |
| Navigation            | Clear active item using text weight plus an indicator. Preserve visible labels and access to search. Do not rely on colour alone.                               |
| Mobile menu           | Labelled button with expanded state. Keyboard operable; keep focus order logical. Restore focus on close when using a modal drawer.                             |
| Featured article      | Lilac surface, serif title, concise summary and one primary reading action. Avoid nested interactive targets.                                                   |
| Informational callout | Callout surface, 3px accent left edge, clear text label, 16px body and 16-20px padding. Do not use this style for every severity.                               |
| Code block            | Native light/dark syntax themes, 14px monospace and framework line height. Preserve command whitespace; offer local scrolling for long lines.                   |
| Inline code           | Monospace, restrained tinted surface, enough padding to distinguish it without breaking line rhythm.                                                            |
| Table                 | 16px text, strong column headers, generous cell padding and light row rules. Associate headers semantically. Scroll only the table when needed.                 |
| Diagram               | Callout-tinted nodes, labelled connections and readable text. Provide a meaningful text alternative. Distinguish states with shape or labels as well as colour. |
| Search                | Retain Pagefind/Starlight search behaviour, keyboard access, result feedback and empty states. Style without replacing its semantics.                           |

Size primary touch targets to at least 44px by 44px where practical, including Menu, search and copy buttons. Avoid hover-only information. Respect reduced-motion preferences; transitions should be brief and functional, with no automatic animation required for reading.

Preserve framework code-copy controls and accessible labels. Syntax-highlighting colours require their own contrast check against the code background. Do not wrap copyable shell commands in ways that alter their content; the prototype's display wrapping is not a production requirement.

Use authentic article diagrams, photographs or illustrations only when they contribute to understanding. Keep imagery responsive and reserve its layout space to avoid jumps. Sanitise all technical examples and screenshots under the existing editorial policy. No private infrastructure detail belongs in design fixtures.

<!-- pagebreak -->

## 7. Astro and Starlight implementation

Apply the guide through shared tokens, scoped styles and the smallest necessary components. Keep Markdown/MDX content, Starlight navigation, headings, search, code rendering, RSS, sitemap and starlight-blog integration intact. The static publishing architecture and deployment pipeline remain authoritative.

Start with theme tokens and typography, then the custom homepage and shared article treatment. Map semantic colours to the installed Starlight version's supported theme variables. Use documented component extension points; verify current APIs before implementation. Scope homepage composition separately from article rules so the dark hero does not leak into documentation pages.

### Core token example

```css
:root {
  --hl-paper: #faf8f3;
  --hl-ink: #252535;
  --hl-accent: #62429a;
  --hl-feature: #e2d7f5;
  --hl-callout: #f0ebf5;
  --hl-font-ui: Arial, Helvetica, sans-serif;
  --hl-font-reading: Georgia, 'Times New Roman', serif;
  --hl-font-code:
    ui-monospace, SFMono-Regular, Consolas, 'Liberation Mono', monospace;
  --hl-reading-size: 1.125rem;
  --hl-reading-line-height: 1.7;
}
```

This abbreviated light palette illustrates the roles. The authoritative mappings and both palettes are in `src/styles/hybrid.css`; its base tokens are dark and its `[data-theme="light"]` override is light. Native Starlight controls provide Light, Dark and Auto, persist an explicit choice, and follow system preference in Auto. No additional theme storage or custom switching script is required.

`HomeHero.astro` provides only the homepage composition and falls back to the native hero elsewhere. `SiteTitle.astro` provides the masthead. The Australian English UI dictionary supplies blog labels because the installed Starlight plugin translation fallback does not carry `en` plugin strings into `en-AU`. Update that dictionary when new blog controls are introduced.

### Implementation acceptance

- Compare the rendered homepage and article with the approved references at 1200px and 390px.
- Check 320px, 700px, 768px, 1024px and 1440px widths, long titles and 200% zoom.
- Verify menu, search, article anchors, focus order, visible focus, copy controls and theme switching with keyboard input.
- Check actual text, control and syntax colours; run automated accessibility checks and inspect the result manually.
- Check article prose, lists, tables, code, diagrams, callouts and image captions with realistic synthetic content.
- Run the repository's required validation and security checks before integration. Verify preview rendering before production deployment.

<!-- pagebreak -->

## 8. Maintenance and verification record

### What is established

The user selected the 04 + 05 hybrid on 10 November 2026. The reference prototypes were rendered at 1200px and 390px; both homepage and article had no horizontal page overflow, their mobile menus opened, and local links resolved. The reference PDF was visually inspected. This guide's solid-colour contrast ratios were calculated from the listed values.

### Implementation evidence and limits

The hybrid is implemented through two component overrides and shared CSS. Local validation covers formatting, lint, Astro/TypeScript, the static build, generated links, negative guard tests and Chromium browser tests. Both palettes are checked with axe on eight routes; responsive checks cover 320, 390, 700, 768, 1024, 1200 and 1440px. Tests exercise mobile navigation and theme selection, search, theme persistence, system preference, enlarged root text, RSS and sitemap. See the acceptance record for deployment evidence.

Automated accessibility checks and 200% root-text enlargement do not establish a complete accessibility audit or browser-zoom equivalence. Firefox, Safari, screen readers, every content combination and real editorial templates remain unverified.

### Keeping the specification current

Edit this Markdown first. Update the PDF in the same change, including its version and date, and render every PDF page for visual inspection. Update reference images when an approved visual change makes them stale. Keep images synthetic and public-safe. Do not change the deployed design merely to make it match an outdated screenshot; resolve the specification deliberately.

Use pull requests for integration and follow the existing validation gates. Changes to typography roles, primary palette, homepage composition or article reading width require an explicit design decision. Routine implementation adjustments may follow the documented responsive and accessibility rules.

### Design review questions

- Does the homepage retain the confidence and visual character of option 04?
- Does the article preserve the warmth and reading comfort of option 05?
- Can readers find guides, investigations, architecture and blog content quickly?
- Does the same hierarchy survive a narrow screen, long title and enlarged text?
- Are framework capabilities and public-content boundaries preserved?

### Document map

- [Printable style guide](style-guide.pdf)
- [Repository README](../../README.md)
- [Architecture decision](../decisions/0001-static-publishing.md)
- [Editorial sanitisation policy](../editorial/sanitisation.md)
- [Foundation acceptance evidence](../acceptance.md)
