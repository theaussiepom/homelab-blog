# Responsive design references

12 November 2026 · Version 1 · Reviewed implementation targets

These are precise drawings from the supplied **The-Aussie-Pom-Responsive-Handoff**, retained as a deliberately small review set. They are not browser screenshots or evidence that the application passed acceptance. The [visual guide](../../style-guide.md) owns the current requirements. Explicit author decisions take precedence, then the written requirements, these references, and unchanged article rules. Earlier geometric homepage concepts are superseded.

| Reference                                                                  | CSS viewport      | Purpose                                         |
| -------------------------------------------------------------------------- | ----------------- | ----------------------------------------------- |
| [320px phone](home-320-light-full.png)                                     | 320 × 900, light  | Compact 140px lockup, gutters and full flow     |
| [390px light](home-390-light-full.png), [dark](home-390-dark-full.png)     | 390 × 844         | Author, typography, feature, note and discovery |
| [Open menu light](menu-390-light-full.png), [dark](menu-390-dark-full.png) | 390 × 844         | Native menu contents, spacing and labels        |
| [Tablet](home-768-light-full.png)                                          | 768 × 1024, light | Menu navigation and stacked hero                |
| [Sidebar and stack](home-1024-light-full.png)                              | 1024 × 768, light | Sidebar independent of hero split               |
| [Wide light](home-1440-light-full.png), [dark](home-1440-dark-full.png)    | 1440 × 1040       | Two-column hero and discovery                   |

Full-page image heights reflect the sample content, not fixed CSS dimensions. Use normal document flow and actual published article data. Modest wrapping differences between the reference renderer’s Liberation fonts and the website’s approved Arial/Georgia stacks are expected. Do not shrink, truncate or rewrite content to imitate a line break.

The supplied brand portrait, wordmarks and favicons are original artwork reused unchanged. The handwritten note and two pointers are new original native SVG decoration from the same handoff, archived in `brand/decor/`. The circle is a flat CSS shape. No reference image is a runtime background or UI component.

Acceptance also requires 430 × 932 light, 768 dark, 320px menu, boundary widths, short-landscape menus, enlarged text, real browser zoom and long-article checks. Keep actual browser screenshots and comparison evidence in the local review deliverables, separate from these source drawings. Existing About wording must compare unchanged before and after the work.
