# Foundation acceptance

Evidence recorded on 10 November 2026. Configuration presence is distinguished from actual execution.

## Verified locally

- Clean `npm ci` on pinned Node 24.22.2 installed the committed dependency graph.
- Formatting, ESLint, Astro/TypeScript checks, production build and all internal page/fragment/asset links passed.
- Twelve Chromium tests passed: eight representative routes with automated WCAG A/AA checks, functional search, documentation metadata/table of contents, mobile navigation, RSS and sitemap.
- Invalid content frontmatter caused Astro validation to fail. Broken relative/absolute same-origin links and fragments caused the link validator to fail. External URLs are intentionally outside this internal-link check.
- Gitleaks 8.30.1 passed current-tree and reachable-history scans; its isolated random synthetic token was detected. No real secret was introduced.
- `npm audit --audit-level=low` reported zero vulnerabilities after the documented build-tool minimatch override.
- Wrangler 4.159.0 dry-run accepted the static assets-only package, with no application bindings or server code.

## Verified on GitHub

The public repository is [theaussiepom/homelab-blog](https://github.com/theaussiepom/homelab-blog), default branch `main`. Squash merging is enabled, merge/rebase merging and auto-merge are disabled, and merged branches are deleted automatically. Secret scanning, push protection, vulnerability alerts and Dependabot security updates are enabled. Actions default to read-only, cannot approve PRs and allow only GitHub-owned Actions.

## Hosted CI and enforcement

- [Initial main CI](https://github.com/theaussiepom/homelab-blog/actions/runs/42716561496) passed publication validation, full-history source safety and dependency audit.
- [Pull-request CI](https://github.com/theaussiepom/homelab-blog/actions/runs/42716812721) passed all four checks, including dependency review.
- Active protected-main rules require those exact four GitHub Actions checks, an up-to-date branch, a pull request, resolved review threads and squash/linear history. There are no bypass actors; deletion and force pushes are blocked. Signing is not enforced.
- Dependabot executed and opened an Actions update pull request; no automatic merging is enabled.
- The initial native-deploy gate rejected a feature-branch revision. The selected final delivery uses GitHub job dependencies and deployment environments; successful live production and preview verification is recorded below.

## Cloudflare delivery verified

- [Final PR validation and preview upload](https://github.com/theaussiepom/homelab-blog/actions/runs/42719298839) passed all four checks and the GitHub preview deployment job. The production job was skipped on the PR.
- The [actual preview URL](https://1e5a4e55-homelab-blog.theaussiepom.workers.dev/) rendered the placeholder homepage over HTTPS.
- [First production run](https://github.com/theaussiepom/homelab-blog/actions/runs/42719885147) passed validation, source safety and dependency audit before its production job succeeded. The PR-only jobs were skipped on main.
- [Production](https://theaussiepom.me/) and the [Cloudflare hostname](https://homelab-blog.theaussiepom.workers.dev/) are configured. Eleven representative public-domain routes/assets returned HTTP 200 with certificate verification enabled, including XML-valid RSS and sitemaps. The homepage supplied all four configured security headers.
- Live browser search on the Cloudflare production hostname found the distinctive synthetic phrase and navigated to the placeholder guide. The guide's navigation and table of contents rendered.
- Cloudflare's token review confirmed Individual Workers Editor access for `homelab-blog` only. GitHub secret metadata confirms both deployment secret names exist; no secret values or private account identifiers are committed.
- Native Cloudflare Git Builds was fully disconnected. GitHub Actions is the sole automatic deployment authority. The superseded bootstrap user token was permanently deleted; the separate blog-only account token remains the deployment credential.
- The production environment permits only main; the preview environment permits PR merge references. Fork/bot deployment is excluded by workflow conditions. A real fork PR was not exercised.
- GitHub enforces SHA pinning for Actions and permits only GitHub-owned Actions. The Actions update PR was superseded by the incorporated current stable pins and is closed.

## Remaining verification and limits

The CodeRabbit configuration is present. The existing installation now includes this repository; the six prior repository selections were preserved. Automatic fixes and commits remain disabled in the repository configuration. On [PR #4, CodeRabbit recognised the repository YAML and CHILL profile](https://github.com/theaussiepom/homelab-blog/pull/4#issuecomment-6754629673), but skipped automatic review because the public repository has fewer than 10 stars. Its comment offers a manual review trigger; no completed CodeRabbit review is claimed. Dependabot has executed and produced an Actions update; its npm update initially encountered the unsupported TypeScript major, now excluded until the Astro validator supports it. A later weekly npm update run has not been observed.

Rollback commands and UI are documented, but a controlled rollback has not yet been exercised. Cross-region availability and every browser/assistive-technology combination have not been tested. Public-route verification is distinct from local-client DNS configuration. Commit signing is not configured or enforced.

## Phase 2 theme validation — 10 November 2026

The selected 04/05 hybrid is implemented with a custom homepage and masthead, shared typography, light/dark semantic palettes and the native Light/Dark/Auto control. The README links the versioned Markdown style guide and its printable PDF. Native article navigation, search and blog rendering remain in place. The synthetic guide includes a note, table and labelled diagram to exercise those treatments.

Local `npm run validate` passed formatting, lint, Astro/TypeScript, static build, generated-link validation, negative guard tests and all 34 Chromium tests. Tests cover eight routes with axe in both palettes; homepage, guide and blog reflow at 320/390/700/768/1024/1200/1440px; mobile navigation and theme controls; persistence and system preference; keyboard skip/search focus; 200% root-text enlargement; RSS and sitemap. Visual inspection covered desktop homepage, guide and blog in both palettes and the mobile homepage. The PDF was rendered and inspected page by page.

The blog's Australian English labels use an explicit local dictionary because plugin English strings do not fall back to `en-AU` in the installed Starlight version. A regression test checks that raw translation keys do not reach the blog index or post.

This records local evidence; the integrating pull request and its GitHub Actions runs record hosted validation, preview and production deployment. Automated axe checks are not a full accessibility audit; 200% root text does not establish browser-zoom equivalence. Safari, Firefox, screen readers and real editorial templates remain unverified. Local split DNS/Traefik changes are outside this phase.

## Phase 3 editorial workflow — 10 November 2026

Four MDX templates and `npm run new:article` support guides, architecture articles, investigations and posts. The generator defaults to a draft, uses native metadata and refuses invalid slugs or existing routes. The shared article introduction displays description, author, date and topics; blog metadata remains native. The README links the writing workflow, templates and updated style-guide v1.2 (Markdown and nine-page PDF).

Local `npm run validate` passed all checks and 40 Chromium tests. Metadata negative cases cover missing/empty fields, invalid dates/types/tags, reversed update dates, duplicate tags and unfinished publication metadata. Generator tests cover all four templates, route collisions and traversal rejection without overwriting content. A separate actual Astro build was deliberately given a synthetic article without authors; it failed with the expected schema error, and the temporary fixture was removed.

The synthetic workflow example was created by the generator. It returned HTTP 200 with a draft notice in development and had no generated route in a successful production build while `draft: true`. After editing it into a completed synthetic example and setting `draft: false`, the build, sitemap and live browser search tests included it. All other templates were generated and rendered successfully as local drafts; those temporary template-test articles were removed.

Permanent synthetic guide/blog draft canaries remain excluded: production routes and their tag/author pages return 404; generated HTML/XML/JSON and route-name scans contain no canaries; completed exact-phrase Pagefind queries return no draft results. The checker itself is tested against intentionally leaked output. Unquoted Pagefind queries can produce fuzzy matches, so a fuzzy match alone is not evidence of a draft leak.

The article layout was visually reviewed in light/dark modes at desktop and mobile widths. The PDF was rendered and inspected on every page. Hosted preview and production evidence is recorded on the integrating PR and its workflow runs. Draft source/history and static public assets are still public; rendering exclusion is not confidentiality. Real article production, Safari/Firefox, screen-reader verification and local DNS/Traefik remain outside this work.

## Comments and guide alignment, 11 November 2026

[PR #8](https://github.com/theaussiepom/homelab-blog/pull/8) added Giscus below published articles, preserving the native footer. The app selection was verified as **homelab-blog only**, with metadata read and Discussions read/write permissions. Local validation passed all 43 Chromium tests, including comment loading, theme messages and a blocked-script fallback; the third-party widget was stubbed for those integration tests. Source/history secret scanning and its negative case passed, and npm audit reported no vulnerabilities. Required hosted checks and the actual preview passed, followed by successful [production CI/CD](https://github.com/theaussiepom/homelab-blog/actions/runs/42903885526).

The real embedded widget was then inspected on the production Worker hostname: it displayed zero comments, reactions and GitHub sign-in for posting. No test comment or OAuth authorisation was submitted. The custom domain produced a certificate warning in the local browser; this verification did not resolve that warning or change DNS. Drafts and review previews do not connect to live comments.

Cloudflare Web Analytics was already enabled through automatic setup for the public domain. Its live dashboard showed page views, visits, paths and referrers. [Comments and readership](comments-and-analytics.md) documents access and metric limits; no duplicate analytics snippet was added.

The author endorsed the journey article as the reference for voice and layout. The Markdown guides define the required storytelling, pace, human detail, visual placement and reading-focused contents navigation. [PR #9](https://github.com/theaussiepom/homelab-blog/pull/9) applies the approved contents layout through shared article components for guides, architecture articles, investigations and blog posts. The prose and photograph from the journey article remain unpublished. The PDF edition was retired at the author's request. Earlier PDF references in this acceptance history describe the former deliverable, not a current maintained edition.

Final local validation passed all 48 Chromium tests, including the shared article layout at 320/390/799/800/1024/1152/1440px in both themes. Checks cover contents targets, active-section tracking, mobile contents and site browsing, reading width, reflow, accessibility, comments, search and draft exclusions. Desktop light/dark guides and the mobile blog post were visually inspected. Formatting, types, generated links and source/history secret checks passed. Firefox, Safari and screen-reader coverage remain unverified. Hosted review and deployment evidence belongs to PR #9 and its workflow runs.

## Estimated reading time, 11 November 2026

The shared article introduction now shows an automatically calculated estimate in whole minutes, rounded up at 200 words per minute with a one-minute minimum. It counts article text and code while excluding link destinations, comments in the source, MDX imports and authoring notes. Navigation, the author bio and reader comments are outside the article compiler input. The Markdown style guide and editorial workflow specify this behaviour.

Local `npm run validate` passed all checks and 41 Chromium tests. Boundary checks verified that 200 words gives one minute and 201 gives two, with no seconds in the displayed label. Both published articles expose the estimate in light and dark themes. Local development also showed five minutes on the third article while preserving its draft notice; the production build continues to exclude that article. Desktop and narrow-layout checks found no horizontal overflow. Source/history safety checks passed and npm audit reported zero vulnerabilities. Hosted preview and production verification are tracked by the integrating PR and its deployment runs.

## The Curious Engineer and shared homepage navigation, 11 November 2026

The author selected **The Curious Engineer** as the publication name. The shared masthead reads its name from Starlight configuration and has no subtitle. The homepage uses the same sidebar and mobile Menu control as article pages, with Home and direct story links. The homepage’s separate section navigation and landing-page cards are replaced by links to actual published articles. Start Here and the Architecture index are removed. Exact-path Cloudflare redirects send their former URLs home while retaining article URLs.

Local validation passed formatting, lint, Astro checks, editorial guards, the production build, internal links and all 36 Chromium tests. The tests cover the shared homepage sidebar, mobile menu and theme selection, article contents, both palettes, 320–1440px reflow, search, comments, sitemap and draft exclusion. A focused homepage check also verified the final browser title, `Home | The Curious Engineer`, and captured a review image. Visual inspection covered desktop dark and mobile light layouts, including the full masthead and mobile story links. The Markdown style guide records the name, subtitle-free masthead, 80px header and shared navigation.

The production build contains neither retired landing page nor the third article draft. The redirects are present in the built static assets; their Cloudflare behavior is checked on the hosted preview and production by the integrating PR. No article prose or publication status changed in this update.
