# Writing and publishing

Use the article type that matches the reader's need. Guides explain how to achieve and verify an outcome; architecture articles explain boundaries and decisions; investigations explain evidence and uncertainty; blog posts communicate shorter changes and lessons. The templates are starting points, not a requirement to retain empty sections.

## Establish the reader and voice

Follow the [editorial voice guide](voice.md) throughout. Before drafting, identify the reader's goal, article type, assumed knowledge and available evidence. Use the authoring brief in the template to record those choices; it stays in the MDX source without appearing on the page, but is still public once pushed. Do not add unsupported frontmatter fields for these notes.

Begin the publication with approachable foundations and progress towards intermediate decisions and advanced investigations. Keep the same human, conversational voice at every level. State prerequisites naturally, explain unfamiliar terms at the chosen level and link to existing foundational articles where useful. An advanced topic does not require formal or impersonal prose.

Use supplied experiences accurately. Ask for missing evidence when it is needed for a claim; otherwise narrow the claim or identify the uncertainty. Humour is optional and must fit naturally. The [repository instructions](../../AGENTS.md) give coding assistants the reading order and drafting procedure.

## Create a draft

From the repository root, create an article with a short kebab-case slug:

```sh
npm run new:article -- guide my-slug
```

| Type            | Destination                        | Template                                     |
| --------------- | ---------------------------------- | -------------------------------------------- |
| `guide`         | `src/content/docs/guides/`         | [Guide](templates/guide.mdx)                 |
| `architecture`  | `src/content/docs/architecture/`   | [Architecture](templates/architecture.mdx)   |
| `investigation` | `src/content/docs/investigations/` | [Investigation](templates/investigation.mdx) |
| `post`          | `src/content/docs/blog/`           | [Blog post](templates/post.mdx)              |

The command fills the title and date placeholders and creates an MDX file with `draft: true`. Edit the title, summary, author and tags before publication; edit the listing excerpt for blog posts too. Replace the example prose and instructions; retain a synthetic-content notice whenever the article still contains invented examples. The `page` article type is for navigation and landing pages, not a fifth article template.

## Metadata contract

| Field         | Rule                                                                                                                                                              |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `articleType` | `guide`, `architecture`, `investigation` or `post` for articles; defaults to `page` for landing and generated pages.                                              |
| `title`       | A specific, reader-facing title. The page shell supplies the H1; start body sections at H2.                                                                       |
| `description` | Articles require a 20–240 character summary describing their scope and value.                                                                                     |
| `excerpt`     | Optional blog-only introduction for index and tag listings. The post template includes it; omitting it makes the plugin render the full article body in listings. |
| `date`        | Articles require an unquoted YAML date in `YYYY-MM-DD` form. Use the intended publication date.                                                                   |
| `authors`     | Articles require an array of objects with a nonempty `name`. Replace `REPLACE_AUTHOR` before publication.                                                         |
| `tags`        | Articles require a nonempty list of kebab-case tags. Reuse existing useful tags rather than creating a synonym for every article.                                 |
| `draft`       | Native Starlight boolean. Keep `true` while writing; change to `false` when ready for a public preview.                                                           |
| `lastUpdated` | Optional explicit YAML date, no earlier than `date`, or `false`. Record a meaningful article update, not an automatic deployment timestamp.                       |

Landing and generated pages default to `articleType: page` and do not need article authors, dates or tags. The four article templates set their type explicitly; preserve it so article validation applies. Do not add a competing publication-status field or manually maintained reading time. The shared introduction calculates estimated reading time for guides, architecture articles and investigations at 200 words per minute, rounded up to whole minutes. Source-only notes and page furniture are excluded. The blog integration owns reading metrics for blog posts. A future date does not schedule publication: `draft: false` makes an article eligible for the next production build regardless of its date.

## Write and preview locally

Run `npm run dev` and open the article's local route. Development includes native drafts. Use ordinary Markdown for prose, lists, tables and code; MDX permits the maintained Starlight components imported by the templates. Preserve code-copy controls and provide explanatory text for diagrams and meaningful alternative text for images.

Use the [style guide](../design/style-guide.md) for type, colour and layout. Check both themes and a narrow viewport. Inspect long titles, commands, tables, notes and the article's table of contents. Use descriptive link labels and an orderly heading hierarchy.

Keep evidence precise:

- **Observed:** a result directly seen, with its method, conditions and relevant version.
- **Inferred:** an interpretation supported by identified evidence, with remaining alternatives.
- **Not verified:** a proposed behaviour or outstanding check that has not been established.

Native notes with those titles make the distinctions visible without inventing a separate evidence format. Include the distinction in the prose too. Cite current primary sources beside technical claims; state testing and version limits. A successful build validates publication mechanics, not the truth of an operational claim.

## Prepare a public preview

Every branch, commit and preview in this project is public. **Draft status is a rendering control, not a privacy boundary.** Sanitise content before the first push using the [public-content policy](sanitisation.md), including deleted lines, images and Git history. Never push sensitive material with the intention of redacting it later.

Both CI previews and production use a production build. They omit `draft: true` articles, including their generated publication listings. Local `npm run dev` is the place to review unfinished drafts. When the content is safe and ready for external review:

1. Replace scaffold guidance, the author placeholder and sample tags. Remove the generated `Draft:` title prefix; published articles reject that prefix and `REPLACE_AUTHOR`. Check dates, descriptions and source attribution.
2. Change the article to `draft: false`. Keep the change on a feature branch.
3. Run `npm run validate` and the documented source-safety checks. Inspect the built site with `npm run preview`; unlike development, it reflects draft exclusions.
4. Review the full diff for accuracy and public safety, then push and open a pull request. State reader-visible changes, evidence and unresolved uncertainty.
5. Wait for the required checks and inspect the actual Cloudflare preview URL reported by CI. Same-repository owner PRs receive previews; untrusted PRs do not receive deployment credentials.

The review should cover voice, audience fit, evidence, metadata, links, sources, screenshots, responsive layout, both themes, search and relevant RSS or archive listings. Check that any humour serves the explanation and that first-person claims are supported. Automated checks support this review; they cannot prove that content is accurate or safe to publish. CodeRabbit may skip automatic reviews on this repository, so its presence alone is not a completed review.

## Publish and verify

Squash merge only after required checks pass and review threads are resolved. GitHub Actions validates `main` and deploys production. A merged PR is not proof that deployment succeeded: check the production job and inspect the live article, navigation and search. For blog posts, also check the blog index and RSS.

Use the [deployment guide](../deployment.md) for delivery boundaries and rollback. Record local checks, hosted checks and live verification separately. Correct subsequent content errors through a new PR; update `lastUpdated` when the substantive article changes. If a secret is exposed, follow the revocation and history-remediation procedure in the public-content policy rather than relying on a content deletion.
