# Foundation acceptance

Evidence recorded on 10 November 2026. Configuration presence is distinguished from actual execution.

## Verified locally

- Clean `npm ci` on pinned Node 24.22.2 installed the committed dependency graph.
- Formatting, ESLint, Astro/TypeScript checks, production build and all internal page/fragment/asset links passed.
- Twelve Chromium tests passed: eight representative routes with automated WCAG A/AA checks, functional search, documentation metadata/table of contents, mobile navigation, RSS and sitemap.
- Invalid content frontmatter caused Astro validation to fail. Broken links and fragments caused the link validator to fail.
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
- The production gate was exercised on a feature-branch commit and correctly rejected it rather than accepting the successful main CI run.

## Pending operational verification

CodeRabbit app execution, Cloudflare Git integration, preview, production hostname/HTTPS/search and rollback. The Cloudflare setup is prepared, with explicit CI-gated production and non-promoting preview commands; build-token permissions require an account-owner decision before creation. No deployment is claimed.

The CodeRabbit configuration is present, but no CodeRabbit review has been observed on the verification PR. Dependabot execution has been observed. Commit signing is not configured; the ruleset must not claim it is enforced.
