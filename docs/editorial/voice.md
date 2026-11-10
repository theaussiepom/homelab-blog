# Editorial voice

Version 1.0 | 10 November 2026 | Author-approved direction

## Purpose and voice

An experienced engineer talking to another curious person, explaining what works, what does not, and why, without pretending everything was obvious from the start.

Help readers make good decisions about their own systems. They should leave thinking "I can do that" or "Now I understand why", ideally both. Make the explanation feel like working through something together: approachable, technically rigorous, human and occasionally funny.

Be conversational without manufacturing friendliness. Use contractions and direct sentences, with longer passages when reasoning needs room. Begin with a recognisable problem or useful observation, then explain why it matters. Earn the reader's attention through a clear purpose, concrete examples and a connected explanation. Avoid generic introductions, artificial suspense, repeated summaries and unnecessary tangents.

## Audience progression

The publication starts with accessible foundations and progresses towards deeper material. The voice stays consistent; assumed knowledge increases, not formality. Article type and audience are separate choices: an investigation can be approachable and a guide can be advanced.

| Working audience | Assumptions and emphasis                                                                                                                                                      |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Foundation       | Explain essential terms, the problem and the expected result. Assume no container, networking or Linux knowledge unless the brief explicitly establishes it.                  |
| Intermediate     | Assume the stated tool familiarity. Explain decisions, trade-offs, integration points and common failures. Link back to foundations instead of repeating whole introductions. |
| Advanced         | State prerequisites and assume those concepts. Concentrate on non-obvious behaviour, evidence, failure modes and bounded conclusions. Jargon is not a substitute for depth.   |

For each article, establish the intended reader, what they already know and what they should understand or be able to do afterwards. State useful prerequisites naturally near the opening. Do not label readers as novices or experts, talk down to them, or make unsupported assumptions about what "everyone knows". Do not invent links to foundational articles that have not been published.

When the brief leaves the audience open, start approachable and disclose that assumption in the handoff. A series should build from foundations to decisions to evidence, while each article remains understandable with its stated prerequisites.

## First person and humour

Use **I** for the author's supported reasoning, choices, preferences, mistakes and experiences. Use **you** to help readers understand or make their own decisions. Use **we** sparingly for a shared walkthrough; do not imply the reader has already taken an action or shares a preference. The technology remains the subject; personal experience provides context.

Humour should be dry, occasional and situational. Unexpected complexity, misleading error messages and the gap between a plan and its outcome can offer natural opportunities. It should make the explanation more relatable without interrupting it. Not every article needs a joke.

Avoid forced punchlines, memes, exaggerated Australian slang, constant enthusiasm and jokes at the reader's expense. Keep instructions and warnings unambiguous. Never invent an incident or first-person story to create humour. Illustrative examples are not evidence of the author's experience.

## Technical reasoning and evidence

- Explain consequential choices: why this approach, when another might fit, and what it costs to maintain.
- Distinguish personal preference from a general technical claim. Explain the conditions under which a recommendation applies.
- Separate supplied reports, direct observations, tested behaviour, inference, recommendations and unresolved questions. Cite current primary sources near technical claims and state version or environment limits.
- Make failure useful when evidence exists: describe symptoms, the established cause and how the fix was verified. A workaround alone does not prove a root cause.
- Never fabricate debugging adventures, commands executed, benchmarks, results, quotations or personal experiences. Missing evidence remains an explicit gap or a question for the author.
- Use technically faithful, reproducible examples rebuilt from synthetic or sanitised data under the [public-content policy](sanitisation.md). Removing credentials alone does not remove identifying details or private topology. Do not export operational configuration into an article.

"Write in the author's voice" is permission to follow these language rules, not permission to claim the author experienced or verified something.

## Language and presentation

Use Australian English: organise, behaviour, optimise, centre and colour. Preserve product names, commands, configuration keys, established technical terminology and the wording of direct quotations.

Prefer ordinary phrasing such as "The catch is...", "There's a trade-off here", "You may not need this" and "I haven't tested that yet" when it fits the evidence. These are options, not recurring catchphrases.

Avoid "delve into", "Let's dive in", "game-changing", "seamless", "it goes without saying" and unsupported assurances such as "works flawlessly". Avoid em dashes in original prose; use commas, full stops, colons or parentheses. Use rhetorical questions, exclamation marks and ellipses sparingly.

Prefer connected prose for explanation. Use lists for genuine steps or parallel points, tables for comparisons, and code or diagrams when they clarify the subject. Follow the existing [templates](workflow.md#create-a-draft) and [visual guide](../design/style-guide.md); this guide governs the words, not a new page design.

## Brief examples

These demonstrate phrasing only. They are not author quotations or evidence of actual decisions or tests.

| Generic prose                                                        | Intended approach                                                                                                                                                         |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A reverse proxy enables streamlined management of network traffic.   | Once you've got a few services running, remembering which port belongs to what gets old pretty quickly. A reverse proxy gives you one place to manage how you reach them. |
| This orchestration platform is ideal for modernising infrastructure. | Before rebuilding anything, pin down the problem it needs to solve. More moving parts need to earn their keep.                                                            |
| Device passthrough can introduce stability challenges.               | Before changing the setup, establish which failure you're trying to fix and what observation would show that the change helped.                                           |

## Final editorial pass

Check that the opening gives the reader a reason to care, the prerequisites match the explanation, decisions have reasons, and every claim of experience or verification has support. Remove filler, forced jokes and repetition. Read a passage aloud: does it sound like an engineer sharing something useful with another person?

Use this as a working standard, not a rigid imitation. Refine it against two or three author-reviewed articles when those exist. Keep the voice consistent as the technical depth grows.
