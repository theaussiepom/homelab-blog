# Editorial voice

Version 1.1 | 11 November 2026 | Author-approved article benchmark

## Purpose and voice

An experienced engineer talking to another curious person, explaining what works, what does not, and why, without pretending everything was obvious from the start.

Help readers make good decisions about their own systems. They should leave thinking "I can do that" or "Now I understand why", ideally both. Make the explanation feel like working through something together: approachable, technically rigorous, human and occasionally funny.

Be conversational without manufacturing friendliness. Use contractions and direct sentences, with longer passages when reasoning needs room. Begin with a recognisable problem or useful observation, then explain why it matters. Earn the reader's attention through a clear purpose, concrete examples and a connected explanation. Avoid generic introductions, artificial suspense, repeated summaries and unnecessary tangents.

## Approved reference and storytelling

The author-reviewed article **From a NAS VM to Proxmox: five versions of my homelab** is the benchmark for warmth, conversational language, storytelling and pace, endorsed on 11 November 2026. Use its approach when writing new material, without copying its anecdotes, jokes or section order into unrelated articles. This guide defines the required writing standard; the editorial workflow controls publication.

Give the reader a person and a reason to care before introducing the infrastructure. The reference begins with a garage-door problem, the discovery of Home Assistant and the possibilities that made it interesting. It gives that discovery room before explaining the NAS, containers or Proxmox. A summary should invite readers into the story, not deliver an abrupt inventory of technologies or compress the whole journey into one breath.

Make the practical result tangible. The living-room downlights, a second coordinator on the other side of the house and the tablet dashboard show what the engineering made possible. A list of blinds, scenes and dashboards cannot do the same job by itself. Use a real, supported example to explain what a feature means to the person using it. Source inspection can establish how an automation is configured; it cannot supply an invented evening watching it work.

Let each move follow from the previous one: what the author wanted, what the setup made possible, what became awkward, and why the next choice made sense. This is a way to connect reasoning, not a mandatory four-part structure. Use natural transitions between sections rather than treating each platform as a separate product review. Explain the consequence of a change, such as losing add-ons while gaining control, before moving on.

Keep paragraphs focused and give consequential changes enough space. Short sentences and occasional one-line paragraphs can carry a pause or a dry observation. Do not turn every sentence into a separate paragraph, repeat the same point in prose and a diagram, or rush a new machine, operating system and storage arrangement into one compressed sentence. Trim repetition before trimming the details that help readers picture the situation.

The author's curiosity, learning and connection with the community are part of the story. Technical limitations need clear explanations, but the article should also convey what made the work satisfying and what possibilities kept it going. Warmth comes from those specifics and an honest relationship with the reader, not from adding enthusiastic adjectives or repeatedly saying something is exciting.

End with a reason to keep reading. The reference returns to the garage door and the possibilities still to explore, names the next architectural decision, then closes with the author's own humour. A practical guide can finish with the useful result and a logical next step; an investigation can finish with what the evidence now explains. Avoid a generic recap, an apologetic dismissal of the project, a sudden sales pitch or a vague promise of more content. Do not invent a published follow-up or a dramatic cliffhanger.

Templates provide scaffolding. Adapt their headings and remove unused sections so the explanation feels connected. A personal architecture story does not need to read like an architecture decision record. A procedure still needs usable steps, and an investigation still needs inspectable evidence.

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

Use **I** for the author's supported reasoning, choices, preferences, mistakes and experiences. Use **you** to help readers understand or make their own decisions. Use **we** sparingly for a shared walkthrough; do not imply the reader has already taken an action or shares a preference. Keep the technical substance clear while allowing the author's curiosity and experience to carry the story.

Humour should be dry, occasional and situational. Unexpected complexity, misleading error messages and the gap between a plan and its outcome can offer natural opportunities. It should make the explanation more relatable without interrupting it. Not every article needs a joke.

Avoid forced punchlines, memes, exaggerated Australian slang, constant enthusiasm and jokes at the reader's expense. Keep instructions and warnings unambiguous. Never invent an incident or first-person story to create humour. Illustrative examples are not evidence of the author's experience.

Preserve the author's approved humour instead of polishing it into neutral documentation. The reference's comments about losing free time and becoming AliExpress's favourite customer are directed at the author's own enthusiasm. They do not belittle the reader, the community or the people maintaining the tools. Remove flippant or dismissive asides that make someone's difficulty sound trivial; words such as "just" and "obviously" need particular care around instructions.

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

In article prose, explain unfamiliar acronyms before using the shortened form. An acronym in the title does not count as its explanation in the body. Prefer a plain word when an abbreviation adds little. Link the first substantive mention of a named product, project or technology to its official site or a suitable primary-source introduction. For a credited source of inspiration, use the specific article or video confirmed by the author; do not guess which tutorial they followed. Later mentions can stay plain; retain additional references when they support a specific technical claim. Keep titles and metadata as plain text.

Prefer ordinary phrasing such as "The catch is...", "There's a trade-off here", "You may not need this" and "I haven't tested that yet" when it fits the evidence. These are options, not recurring catchphrases.

Avoid "delve into", "Let's dive in", "game-changing", "seamless", "it goes without saying" and unsupported assurances such as "works flawlessly". Avoid em dashes in original prose; use commas, full stops, colons or parentheses. Use rhetorical questions, exclamation marks and ellipses sparingly.

Prefer connected prose for explanation. Use lists for genuine steps or parallel points, tables for comparisons, and code or diagrams when they clarify the subject. Follow the existing [templates](workflow.md#create-a-draft) and [visual guide](../design/style-guide.md); this guide governs the words, not a new page design.

## Brief examples

These excerpts from the approved article show how the voice works. Learn from their effect; do not reuse the author's experience or repeat the jokes in another article.

| Approved wording                                                                                            | What to preserve                                                                    |
| ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Home Assistant changed my life. I no longer have any time for myself.                                       | Dry humour aimed at the author's own enthusiasm, with room for the reader to smile. |
| The first coordinator was upstairs. The second went downstairs, on the opposite side of the house.          | Concrete, ordinary language that makes an engineering choice easy to picture.       |
| There was more to set up, but vastly more control over what I could run and how everything fitted together. | A candid trade-off connected to the author's actual experience.                     |
| The free time can wait. I've got a few more things I want to build.                                         | A warm ending that returns to the opening and leaves the author's curiosity alive.  |

## Final editorial pass

Check that the opening gives the reader a reason to care, the prerequisites match the explanation, decisions have reasons, and every claim of experience or verification has support. Check the joins between sections: does each change follow from something the reader now understands? Can the reader picture a useful result, rather than only a collection of services? Does the ending leave them curious about a specific next step?

Remove robotic phrasing, cold or dismissive asides, forced jokes and repetition. Read the opening, a technical section and the ending aloud. They should sound like the same engineer sharing something useful with another person. If the article feels rushed or underwhelming, reconsider its narrative and emphasis before substituting individual words.

Use the approved article as the current reference, and refine this guide as further articles are reviewed. Preserve the voice as technical depth grows; do not turn later articles into formal documentation merely because their prerequisites are more advanced.
