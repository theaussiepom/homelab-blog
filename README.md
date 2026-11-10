# HomeLab Notes

Public, static homelab publication at **https://theaussiepom.me** (intended production address; see [acceptance](docs/acceptance.md) for deployment evidence). Current articles are explicitly labelled placeholders or synthetic editorial examples. No real technical articles or private infrastructure data are included.

## Visual design

The approved direction combines the Technical magazine's confident homepage with the Quiet personal publication's warm article reading experience. Follow the [visual style and layout guide](docs/design/style-guide.md) for typography, colours, spacing, components and responsive layouts. A [printable PDF edition](docs/design/style-guide.pdf) is also available. The shared theme implements that direction in light and dark modes, with a system-following Auto option. The guide records the native navigation adaptations and remaining validation limits.

## Stack and local development

Astro 7.4.8, Starlight 0.42.10 and starlight-blog 0.30.2 provide static Markdown/MDX documentation, a blog, Pagefind search, RSS, sitemap, responsive navigation and article tables of contents. Direct npm dependencies use exact versions; `package-lock.json` pins the transitive graph with integrity hashes.

Use Node **24.22.2**, a supported Maintenance LTS patch (supported until April 2028). This conservative compatible LTS line is pinned in `.nvmrc`, `.node-version`, `package.json` and CI. Update the exact pin deliberately when security patches are released. Node 26 is the newer LTS line; adoption is a separate compatibility update.

```sh
nvm install
nvm use
npm ci
npm run dev
```

## Validation

```sh
npm run format:check
npm run lint
npm run check
npm run build
npm run links
npx playwright install chromium
npm test
node scripts/test-guards.mjs
npm audit --audit-level=low
```

`npm run validate` runs formatting, lint, Astro/TypeScript checks, the production build, all generated internal links/fragments/assets, editorial/scaffold negative cases, draft-exclusion guards and browser tests. Browser tests cover representative pages, search results, mobile navigation, RSS, sitemap and automated WCAG A/AA checks. Automated accessibility testing is not a complete accessibility audit.

Secret scanning uses the checksum-pinned official Gitleaks 8.30.1 binary, scanning both the current tree and complete reachable Git history with redacted diagnostics. Initialise Git before scanning and retain full history in CI:

```sh
python3 scripts/install-gitleaks.py /tmp/homelab-blog-tools
python3 scripts/scan-secrets.py /tmp/homelab-blog-tools/gitleaks
```

The scanner guard deliberately generates a fake token in temporary storage and requires detection; no live credential is used. `node scripts/test-guards.mjs` verifies broken links and fragments fail.

## Structure

- `src/content/docs/`: homepage, Start Here, Guides, Architecture, Investigations and blog posts.
- `src/content.config.ts`: Starlight and blog content schemas.
- `astro.config.mjs`: presentation, navigation and canonical origin.
- `public/`: static assets and HTTP security headers.
- `scripts/` and `tests/`: validation and deployment gates.
- `.github/`: GitHub-hosted CI, dependency updates and contribution template.
- `docs/design/`: approved visual specification, printable guide and synthetic reference images.
- `docs/editorial/`: voice, audience guidance, templates, authoring workflow and sanitisation policy.
- `docs/decisions/`: architecture decisions.

`src/components/` contains the homepage and masthead overrides; `src/styles/hybrid.css` owns the semantic palette and layout. `src/content/i18n/en-AU.json` supplies the blog's Australian English UI labels.

## Writing articles

Follow the [editorial voice guide](docs/editorial/voice.md) and [writing and publishing workflow](docs/editorial/workflow.md). The voice stays human and conversational as the audience progresses from foundations to advanced material. Coding assistants should start with [AGENTS.md](AGENTS.md). Create a draft with:

```sh
npm run new:article -- guide my-topic
```

Choose `guide`, `architecture`, `investigation` or `post`. The command uses the corresponding template, fills the title/date and refuses to overwrite an existing route. Replace the author placeholder, title, summary and example prose, then preview with `npm run dev`. Article metadata validation checks the shared type, summary, author, dates and tags.

Drafts are excluded from production builds and hosted PR previews; they remain visible in local development. Draft source and files under `public/` are still public once pushed. Sanitise before committing or pushing. Set `draft: false` only when ready for a public review preview. The [synthetic workflow example](https://theaussiepom.me/guides/editorial-workflow-example/) demonstrates the resulting article layout without real infrastructure content.

## Publishing and CI/CD

Create a branch, edit Markdown/MDX, run validation and open a pull request. Squash merge only after required checks pass and review threads are resolved. No unattended dependency merging is configured.

GitHub Actions validates pull requests, pushes to `main`, manual requests and weekly dependency/security health. It uses read-only default permissions, SHA-pinned official Actions, GitHub-hosted runners, explicit timeouts and concurrency controls. Pull requests receive no deployment credentials. Dependency review checks newly introduced PR dependencies; npm audit checks the complete installed dependency graph at every severity.

GitHub Actions is the sole deployer to Cloudflare Workers Static Assets. The production job runs only for pushes to `main` after publication validation, source safety and dependency audit succeed. The production environment is restricted to `main`. Preview upload runs after all four checks, only for same-repository PRs authored by the repository owner; forks and dependency bots receive no deployment credentials. Preview versions do not promote production. Native Cloudflare Builds must remain disabled to preserve one deployment authority.

The Cloudflare account-owned deployment token is restricted to the existing `homelab-blog` Worker with Editor access. Its secret and the account identifier are GitHub secrets, never source values. The native Git integration was evaluated, but it only accepts user tokens while the available user-token editor cannot express a single-Worker scope. This technical constraint justifies the GitHub Actions alternative. There is no homelab runner, inbound connection, database or application server code.
See [deployment and rollback](docs/deployment.md), [architecture decision](docs/decisions/0001-static-publishing.md), [source conventions](docs/conventions.md) and [acceptance evidence](docs/acceptance.md).

## Security and remaining setup

Treat every commit as permanently public. Use only synthetic examples; follow the [sanitisation policy](docs/editorial/sanitisation.md). Report vulnerabilities privately through GitHub's security reporting when available; never open an issue containing a secret.

CodeRabbit configuration follows the HomeLab public conventions: Australian English, CHILL reviews, automatic PR reviews and disabled finishing-touch fixes/commits. Its GitHub app must have access before reviews can run. Dependabot checks npm and Actions weekly, grouping compatible routine updates without auto-merging.

Remaining configuration and operational verification are tracked in [acceptance](docs/acceptance.md). Configuration presence alone does not establish a working integration.
