# Cloudflare deployment and rollback

## Ownership and setup

Cloudflare Workers Static Assets is the sole deployment system. GitHub Actions validates; it contains no Cloudflare token. Use the existing account's Free plan and the selected `theaussiepom.me` domain. Do not enable paid add-ons.

Connect `theaussiepom/homelab-blog` to a Worker named `homelab-blog` through Workers Builds:

| Setting               | Value                                       |
| --------------------- | ------------------------------------------- |
| Production branch     | `main`                                      |
| Root                  | repository root                             |
| Build                 | `npm ci && npm run build && npm run links`  |
| Deploy                | `npm run deploy:production`                 |
| Non-production deploy | `npm run deploy:preview`                    |
| Node                  | `24.22.2` (set `NODE_VERSION` if necessary) |
| Build variable        | `SITE_URL=https://theaussiepom.me`          |
| Preview URLs          | enabled                                     |

Install the Cloudflare GitHub integration with access to this repository only, where possible. Do not expose build credentials to untrusted fork PRs. Enable native previews for trusted same-repository branches; fork PRs receive read-only GitHub CI and need a maintainer-reviewed branch for a Cloudflare preview. Disable any duplicate GitHub deployment integration.

`wrangler.json` contains only public build settings and no account ID. It serves `dist/` with no Worker script. Preview uses `wrangler versions upload`, which creates a version URL without changing production. The production script first requires a successful CI push run on the exact current main commit; missing or failed checks, API errors and timeout prevent deployment. Keep GitHub rules active without bypass actors, requiring the verified check names.

Before adding the apex custom domain, inspect existing apex DNS, redirects and Worker routes. Stop for a decision if an existing service would be displaced. Leave all other DNS records and services unchanged. Add the custom domain through the Worker settings, then verify HTTPS, pages, RSS, sitemap and search on the real hostname. A public Worker URL and a verified custom domain are separate acceptance items.

## Rollback

Use the Worker's Deployments screen to select a previously verified version and roll back to it, or use the pinned local Wrangler CLI after authentication:

```sh
npx wrangler deployments list
npx wrangler rollback <previous-version-id>
```

Version IDs are operational values; do not commit them as configuration. Record the chosen version and reason privately. Verify HTTPS and representative routes afterwards. Do not exercise rollback against an unknown live service. Rollback capability is documented until two actual versions and a controlled rollback have been verified.

For a durable source correction, revert through a new pull request and let the normal checks and deployment gate run. A rollback does not change Git history. Preview versions need not be promoted.

## Failure handling

A GitHub API rate limit or unavailable status check intentionally blocks production. Retry after the underlying issue is resolved. Do not bypass the gate, weaken rules or use a direct deploy to make a failed pipeline appear green. A Cloudflare account connection or installation permission block must be resolved by the account owner.

## References

- [Build configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)
- [Build branches](https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/)
- [Version URLs](https://developers.cloudflare.com/workers/configuration/previews/)
- [Rollback](https://developers.cloudflare.com/workers/configuration/versions-and-deployments/rollbacks/)
