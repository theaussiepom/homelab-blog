# Cloudflare deployment and rollback

## Architecture and credentials

GitHub Actions is the sole deployment authority. Native Cloudflare Workers Builds must be disabled. Cloudflare Workers Static Assets serves `dist/` from the Free plan, without application server code or storage bindings. The selected production hostname is `theaussiepom.me`.

The account-owned API token has **Editor** access scoped only to the existing `homelab-blog` Worker. It must not have account-wide Worker permissions, other service permissions or zone routes/DNS access. Add custom domains through the dashboard using the owner's existing access. Do not add domain routes to Wrangler configuration, since the deployment credential should not manage them.

Store `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as encrypted GitHub Actions secrets. Never paste their values into Git, issues, logs or documentation. Node is pinned to 24.22.2. `astro.config.mjs` defaults to the selected public canonical origin; `SITE_URL` can explicitly override it with an HTTPS origin.

### Analytics exclusion configuration

Production CD also reconciles one Cloudflare configuration rule that disables Web Analytics collection for the configured operator addresses on the canonical blog hostname. The hostname comes from the same `siteOrigin`/`SITE_URL` selection as the Astro build. The site remains static; no cookie, hidden link, application Worker or additional public route is needed.

Configure these values in **homelab-blog → Settings → Environments → production**:

| Kind   | Name                             | Purpose                                                                                     |
| ------ | -------------------------------- | ------------------------------------------------------------------------------------------- |
| Secret | `ANALYTICS_EXCLUDED_IPS`         | One or more individual public IPv4/IPv6 addresses, separated by spaces, newlines or commas. |
| Secret | `CLOUDFLARE_ZONE_ID`             | The identifier of the zone containing the canonical blog hostname.                          |
| Secret | `CLOUDFLARE_ANALYTICS_API_TOKEN` | A separate token with **Zone → Config Rules → Edit**, restricted to this zone.              |

The analytics token is separate from the Worker deployment token. Do not expand `CLOUDFLARE_API_TOKEN`. Cloudflare scopes configuration-rule access to a zone, so this new permission can edit other configuration rules in that zone; it cannot be restricted to a single analytics rule. The reconciliation code only manages its own rule, identified by the stable reference `homelab_blog_analytics_excluded_ips`, and refuses unexpected ownership or settings.

The production job runs `scripts/sync-analytics-exclusions.mjs` after validation and the static build, before deploying the assets. It validates all inputs before contacting Cloudflare, masks the parameter values in GitHub logs, then creates or updates the named rule using rule-level API operations. It never replaces an existing ruleset. A repeat with unchanged inputs performs reads only. It reads the result back and checks that unrelated rules remain unchanged. API, credential, validation and verification failures stop the production job. Missing or empty address lists fail without removing an existing exclusion.

Real addresses and zone identifiers must stay out of this public repository and built files. Store these GitHub parameters as environment secrets: ordinary variables would be printed in a step’s environment header before the script could mask them. Pass the values only to the reconciliation step, as shown in the workflow. For example, the address-list syntax can be documented using `192.0.2.7, 2001:db8::7`; those are documentation addresses, not deployment values. Never echo the real parameter, API response or generated rule expression in a workflow step.

To change an address, update the production `ANALYTICS_EXCLUDED_IPS` secret and rerun the production deployment job from the latest validated `main` push run, or let the next reviewed `main` change apply it. A PR preview never receives this credential and never modifies zone rules. A static Worker rollback does not revert the separate analytics rule; restore the previous parameter value and reconcile through CD to roll back its address selection.

An IP exclusion covers everyone sharing that public address. Mobile data, VPNs, IPv6 and a changing residential address may require additional entries or later updates. The exclusion affects future beacon collection only; it does not remove past measurements or remove requests from Cloudflare's separate HTTP/security logs. Keep the dashboard's **Exclude bots** filter enabled for readership reporting.

For live acceptance, compare the same public page before and after CD from the excluded connection: Cloudflare's injected `static.cloudflareinsights.com/beacon.min.js` script should disappear for the matching address. Confirm the rule's read-back result in the production job and inspect a non-excluded connection as a separate control when available. A passing mocked API test is not proof that a zone rule is live.

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
- [Configuration rules and token permission](https://developers.cloudflare.com/rules/configuration-rules/create-api/)
- [Disable Real User Monitoring](https://developers.cloudflare.com/rules/configuration-rules/settings/#disable-real-user-monitoring-rum)
