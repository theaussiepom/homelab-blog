# ADR 0001: Static publishing with Astro, Starlight, GitHub and Cloudflare

- Date: 10 November 2026
- Status: Accepted for the foundation

## Context

A public technical publication needs durable documentation and chronological posts, search and low-maintenance delivery. It must build and remain available when the homelab is offline. The initial phase contains only placeholders.

## Decision

Use Astro static generation, Starlight documentation and the maintained compatible starlight-blog integration. Markdown and MDX share the supported content schema. Built-in Starlight navigation, Pagefind search and sitemap support, plus the blog plugin's RSS and structured metadata, avoid custom publishing engines.

Use a public GitHub repository for reviewable changes, exact dependency pins and a committed lockfile. Adopt public HomeLab conventions for secure Actions and review settings, without infrastructure workflows or private values.

Use Cloudflare Workers Static Assets and its Git build integration for production and preview versions. No Astro server adapter, Worker fetch implementation or storage binding is needed. GitHub CI owns validation; Cloudflare owns deployment. The production command waits for a successful CI push run on the exact current main commit, in addition to protected-branch checks.

## Consequences

Static output reduces attack surface and ongoing operations. Readers get documentation and a blog through one maintained framework. Search is a generated browser index, not a hosted search service. Node is needed at build time only.

Starlight's visual conventions constrain the initial appearance; a later design milestone can refine it. The blog plugin adds compatibility maintenance and must be updated together with Starlight/Astro as needed. Native Cloudflare Git builds do not, by themselves, prove GitHub checks passed; the explicit production gate provides that requirement.

## Alternatives

Cloudflare Pages remains viable, but Workers Static Assets is the preferred supported route. GitHub Actions deployment would give direct dependency ordering but require deployment credentials in GitHub and duplicate native build responsibility if both were enabled. A custom Astro blog would require extra search/navigation/schema code without a foundation-phase benefit.

## Assumptions and open decisions

The selected public hostname is `theaussiepom.me`. No paid plan is authorised. Account-side GitHub app access and actual preview/production behaviour must be verified separately. Final visual identity, article templates and real technical content are outside this decision.

## Sources

- [Starlight setup](https://starlight.astro.build/getting-started/)
- [Starlight Blog setup](https://starlight-blog-docs.vercel.app/getting-started/)
- [Cloudflare Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [Workers Builds configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)
- [Node release schedule](https://github.com/nodejs/Release#release-schedule)
