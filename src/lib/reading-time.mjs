const wordsPerMinute = 200;
const segmenter = new Intl.Segmenter('en-AU', { granularity: 'word' });

// Count article text and code, excluding MDX imports, authoring notes and URLs.
export const articleReadingTime = {
  name: 'article-reading-time',
  before(_root, context) {
    context.data.articleReadingText = [];
  },
  text(node, context) {
    context.data.articleReadingText.push(node.value);
  },
  inlineCode(node, context) {
    context.data.articleReadingText.push(node.value);
  },
  code(node, context) {
    context.data.articleReadingText.push(node.value);
  },
  after(_root, context) {
    const text = context.data.articleReadingText.join(' ');
    let words = 0;
    for (const segment of segmenter.segment(text)) {
      if (segment.isWordLike) words++;
    }
    context.data.astro.frontmatter.minutesRead = Math.max(
      1,
      Math.ceil(words / wordsPerMinute),
    );
  },
};
