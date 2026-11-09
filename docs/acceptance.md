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
- The initial native-deploy gate rejected a feature-branch revision. The selected final delivery uses GitHub job dependencies and deployment environments; its live deployment verification remains pending.

## Cloudflare delivery verified

- [Final PR validation and preview upload](https://github.com/theaussiepom/homelab-blog/actions/runs/42719298839) passed all four checks and the GitHub preview deployment job. The production job was skipped on the PR.
- The [actual preview URL](https://1e5a4e55-homelab-blog.theaussiepom.workers.dev/) rendered the placeholder homepage over HTTPS.
- [First production run](https://github.com/theaussiepom/homelab-blog/actions/runs/42719885147) passed validation, source safety and dependency audit before its production job succeeded. The PR-only jobs were skipped on main.
- [Production](https://theaussiepom.me/) and the [Cloudflare hostname](https://homelab-blog.theaussiepom.workers.dev/) are configured. Eleven representative public-domain routes/assets returned HTTP 200 with certificate verification enabled, including XML-valid RSS and sitemaps. The homepage supplied all four configured security headers.
- Live browser search on the Cloudflare production hostname found the distinctive synthetic phrase and navigated to the placeholder guide. The guide's navigation and table of contents rendered.
- Cloudflare's token review confirmed Individual Workers Editor access for `homelab-blog` only. GitHub secret metadata confirms both deployment secret names exist; no secret values or private account identifiers are committed.
- Native Cloudflare Git Builds was fully disconnected. GitHub Actions is the sole automatic deployment authority.
- The production environment permits only main; the preview environment permits PR merge references. Fork/bot deployment is excluded by workflow conditions. A real fork PR was not exercised.
- GitHub enforces SHA pinning for Actions and permits only GitHub-owned Actions. The Actions update PR was superseded by the incorporated current stable pins and is closed.

## Remaining verification and limits

The CodeRabbit configuration is present; app access and an actual review remain pending. Dependabot has executed and produced an Actions update; its npm update initially encountered the unsupported TypeScript major, now excluded until the Astro validator supports it. A later weekly npm update run has not been observed.

Rollback commands and UI are documented, but a controlled rollback has not yet been exercised. Cross-region availability and every browser/assistive-technology combination have not been tested. Public-route verification is distinct from local-client DNS configuration. Commit signing is not configured or enforced.
