# Cloudflare deployment and rollback

## Architecture and credentials

GitHub Actions is the sole deployment authority. Native Cloudflare Workers Builds must be disabled. Cloudflare Workers Static Assets serves `dist/` from the Free plan, without application server code or storage bindings. The selected production hostname is `theaussiepom.me`.

The account-owned API token has **Editor** access scoped only to the existing `homelab-blog` Worker. It must not have account-wide Worker permissions, other service permissions or zone routes/DNS access. Add custom domains through the dashboard using the owner's existing access. Do not add domain routes to Wrangler configuration, since the deployment credential should not manage them.

Store `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as encrypted GitHub Actions secrets. Never paste their values into Git, issues, logs or documentation. Node is pinned to 24.22.2. `astro.config.mjs` defaults to the selected public canonical origin; `SITE_URL` can explicitly override it with an HTTPS origin.

## Production and previews

The CI workflow's production deployment job runs only for a push to `main`, after publication validation, source safety and dependency audit pass. It uses the `production` environment, restricted to main. Protected-main rules additionally require all four verified CI checks before a PR can merge. Failed or cancelled validation blocks deployment through GitHub job dependencies.

The preview deployment job runs after all four checks, only for PRs from this repository authored by its owner. It checks out the immutable PR head, builds and runs `wrangler versions upload`. This creates a version URL without promoting production. Fork and bot PRs receive validation only, with no deployment secret. Maintainers can review an external contribution and create their own trusted branch if a preview is required. Do not enable `pull_request_target` or pass secrets to untrusted code.

The account's Workers subdomain must have version preview URLs enabled. Read the actual Wrangler output for each URL; do not infer or invent it. Version URLs share the Worker's configured resources, but this Worker has no application bindings.

Local validation commands are documented in the README. Deployment scripts require the account token and identifier from a secure runtime environment; do not store production environment files in the repository.

## Custom domain

Inspect apex DNS, redirects and Worker routes before attaching `theaussiepom.me`. Do not displace another service. Preserve unrelated records and security rules. Add the custom domain through the Worker's Domains settings and verify HTTPS, representative routes, RSS, sitemap and search on the real hostname. A Worker URL and a working custom domain are distinct acceptance items.

## Rollback

From the Worker's Deployments screen, select a previously verified version and roll back. The pinned CLI also supports:

```sh
npx wrangler deployments list
npx wrangler rollback <previous-version-id>
```

Version IDs are operational values; do not commit them as configuration. Record the version and reason privately, then verify HTTPS and representative routes. A rollback changes the deployed version, not Git history. Revert source through a new PR for a durable fix. Rollback is documented capability until two versions and a controlled rollback have been tested.

## Remaining configuration and failure handling

The [acceptance record](acceptance.md) tracks actual token-scope, environment, preview, production and rollback verification. A failed deployment is not success merely because its configuration exists. Resolve credential or platform errors without weakening required checks, widening token scope or enabling a second deployment system.

## References

- [Workers GitHub Actions deployment](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/)
- [Native Builds user-token limitation](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/#api-token)
- [Single-Worker account-owned tokens](https://developers.cloudflare.com/changelog/post/2026-09-15-granular-worker-permissions/)
- [Workers permissions](https://developers.cloudflare.com/workers/authorization/workers/)
- [Version URLs](https://developers.cloudflare.com/workers/configuration/previews/)
- [Rollback](https://developers.cloudflare.com/workers/configuration/versions-and-deployments/rollbacks/)
