# Working in HomeLab Notes

Start in exploration when the user is discussing an idea. Implement when they ask to proceed. Stay within the requested scope. An article-writing request normally means prepare a draft; it does not by itself authorise publication. Honour explicit publishing authority already given in the conversation without asking again.

## Article-writing entry point

For requests such as "write an article about XYZ", read these sources before drafting:

1. [Editorial voice](docs/editorial/voice.md): personality, audience, language and evidence rules.
2. [Writing workflow](docs/editorial/workflow.md): metadata, draft behaviour, validation and publication.
3. [Public-content sanitisation](docs/editorial/sanitisation.md): what may enter this permanently public repository.
4. The matching [guide](docs/editorial/templates/guide.mdx), [architecture](docs/editorial/templates/architecture.mdx), [investigation](docs/editorial/templates/investigation.mdx) or [post](docs/editorial/templates/post.mdx) template.
5. [Visual style guide](docs/design/style-guide.md): established typography, colours, layout and components. Consult the Markdown specification; the PDF is its printable edition.

Use these files as the shared instructions across chats. Do not depend on remembered conversation context or invent a new style for each article. The voice guide owns the words, the template suggests structure, the visual guide owns presentation, and the workflow/schema own publishing mechanics. Evidence and public-content boundaries constrain all of them. Follow the user's explicit brief; surface consequential conflicts rather than silently relaxing a boundary.

## From a topic to a draft

- Establish the reader's goal, article type, assumed knowledge, sources and evidence limits. Infer sensible defaults from the request; ask only for information that materially changes the article or is needed to substantiate a claim.
- For an unspecified audience, use an approachable foundation-level treatment. State the assumption in the draft handoff. For a series, progress from foundations through decisions to advanced evidence without changing the conversational voice.
- Scaffold with `npm run new:article -- <type> <slug>` and retain `draft: true` until publication is authorised and the content is ready. Replace template guidance and metadata placeholders. Remove unused sections rather than filling them with boilerplate.
- Write in Australian English, directly and naturally. Use first person only for experiences or decisions supported by the supplied material. Never invent anecdotes, debugging incidents, commands run, results or verification.
- Reuse native Starlight components and the established theme. Keep commands, configuration keys, quotations and technical terminology accurate. Do not redesign the site while writing an article.
- Preview drafts with `npm run dev`; production builds omit them. Run the relevant validation from the workflow. A successful build does not establish technical truth or that material is safe to publish.
- Hand back the draft location, intended reader, evidence used, checks performed and material uncertainties. Distinguish local validation, hosted CI and live verification. Use the existing protected PR/CI/CD workflow when integration or publication is authorised.

Draft source, comments and assets are public once pushed. Never place secrets or private operational material in a draft, comment, test fixture or commit history.
