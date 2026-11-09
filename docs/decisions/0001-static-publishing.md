# ADR 0001: Static publishing with Astro, Starlight, GitHub and Cloudflare

- Date: 10 November 2026
- Status: Accepted for the foundation

## Context

A public technical publication needs durable documentation and chronological posts, search and low-maintenance delivery. It must build and remain available when the homelab is offline. The initial phase contains only placeholders.

## Decision

Use Astro static generation, Starlight documentation and the maintained compatible starlight-blog integration. Markdown and MDX share the supported content schema. Built-in Starlight navigation, Pagefind search and sitemap support, plus the blog plugin's RSS and structured metadata, avoid custom publishing engines.

Use a public GitHub repository for reviewable changes, exact dependency pins and a committed lockfile. Adopt public HomeLab conventions for secure Actions and review settings, without infrastructure workflows or private values.

Use Cloudflare Workers Static Assets with GitHub Actions as the sole deployment authority. No Astro server adapter, Worker fetch implementation or storage binding is needed. The production job depends on successful validation and security jobs, runs only on a push to main and uses an environment restricted to main. A single-Worker account-owned Editor token is held in GitHub secrets. Preview upload is limited to repository-owner same-repository PRs after CI; forks and bots receive no deployment credentials.

## Consequences

Static output reduces attack surface and ongoing operations. Readers get documentation and a blog through one maintained framework. Search is a generated browser index, not a hosted search service. Node is needed at build time only.

Starlight's visual conventions constrain the initial appearance; a later design milestone can refine it. The blog plugin adds compatibility maintenance and must be updated together with Starlight/Astro as needed. GitHub job dependencies and branch/environment restrictions provide the production gate. Native Cloudflare Builds remains disabled.

## Alternatives

Cloudflare Pages remains viable, but Workers Static Assets is the preferred supported route. Native Workers Builds was initially evaluated. Its generated user token could be reduced to Workers Editor, but the available editor could not restrict that user token to one Worker. Cloudflare documents single-Worker account-owned tokens, while native Builds currently supports user tokens only. The user selected GitHub Actions with a blog-only token rather than retain account-wide Worker access. Exactly one deployment system is enabled. A custom Astro blog would require extra search/navigation/schema code without a foundation-phase benefit.

## Assumptions and open decisions

The selected public hostname is `theaussiepom.me`. No paid plan is authorised. Account-side token scope, GitHub secrets and actual preview/production behaviour must be verified separately. Final visual identity, article templates and real technical content are outside this decision.

## Sources

- [Starlight setup](https://starlight.astro.build/getting-started/)
- [Starlight Blog setup](https://starlight-blog-docs.vercel.app/getting-started/)
- [Cloudflare Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [Workers Builds configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)
- [Node release schedule](https://github.com/nodejs/Release#release-schedule)

- [Scoped account tokens](https://developers.cloudflare.com/changelog/post/2026-09-15-granular-worker-permissions/)
