import { z } from 'astro/zod';
import { resolveAuthor } from './author.mjs';

export const articleTypes = ['guide', 'architecture', 'investigation', 'post'];
export const isPublishedArticle = (data) =>
  articleTypes.includes(data.articleType) && data.draft === false;

// Reuse the native Starlight/blog metadata names; articleType distinguishes landing pages.
export const articleFields = z.object({
  articleType: z
    .enum(['page', 'guide', 'architecture', 'investigation', 'post'])
    .default('page'),
  title: z.string().trim().min(1),
  description: z.string().trim().min(20).max(240).optional(),
  share: z
    .strictObject({
      title: z.string().trim().min(1).max(180).optional(),
      description: z.string().trim().min(20).max(240).optional(),
      image: z
        .string()
        .regex(
          /^\/(?!\/)(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_.-]+\.(?:png|jpe?g|webp)$/,
        )
        .optional(),
      imageAlt: z.string().trim().min(1).max(500).optional(),
    })
    .superRefine((share, context) => {
      if (share.image && !share.imageAlt)
        context.addIssue({
          code: 'custom',
          path: ['imageAlt'],
          message: 'A custom share image requires meaningful imageAlt text.',
        });
    })
    .optional(),
  date: z.date().optional(),
  lastUpdated: z.union([z.date(), z.literal(false)]).optional(),
  authors: z
    .array(z.object({ name: z.string().trim().min(1) }))
    .min(1)
    .transform((authors) => authors.map((entry) => resolveAuthor(entry)))
    .optional(),
  tags: z
    .array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/))
    .min(1)
    .optional(),
});

export function validateArticle(data, context) {
  if (data.articleType === 'page') return;
  const issue = (field, message) =>
    context.addIssue({ code: 'custom', path: [field], message });
  for (const field of ['description', 'date', 'authors', 'tags']) {
    if (data[field] === undefined) issue(field, `Articles require ${field}.`);
  }
  if (
    data.date &&
    data.lastUpdated instanceof Date &&
    data.lastUpdated < data.date
  ) {
    issue(
      'lastUpdated',
      'The update date must not precede the publication date.',
    );
  }
  if (data.tags && new Set(data.tags).size !== data.tags.length)
    issue('tags', 'Tags must be unique.');
  if (!data.draft) {
    if (/^Draft:/i.test(data.title))
      issue('title', 'Replace the draft title before publication.');
    if (data.authors?.some(({ name }) => name.includes('REPLACE_AUTHOR'))) {
      issue('authors', 'Set the author before publication.');
    }
  }
}
