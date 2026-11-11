import { createHash } from 'node:crypto';
import { readFile, realpath } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import opentype from 'opentype.js';
import sharp from 'sharp';
import { isPublishedArticle } from './editorial.mjs';
import { brandAsset } from './site.mjs';

export const fallbackImage = brandAsset('social/tap-opengraph-light.png');
export const fallbackImageAlt =
  'The Aussie Pom, with an illustrated portrait of Ben Dennis';

export async function loadCardAssets() {
  const [font, portrait, template] = await Promise.all([
    readFile('brand/source/fonts/LiberationSans-Bold.ttf'),
    readFile('brand/icons/svg/tap-portrait-lilac.svg', 'utf8'),
    readFile('src/lib/share-card.svg', 'utf8'),
  ]);
  return { font, portrait, template };
}

const text = (value) => value.trim().replace(/\s+/gu, ' ');
const xml = (value) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&apos;',
      })[char],
  );

// The same local font measures and outlines every glyph. No system-font fallback.
export function layoutTitle(title, font) {
  const normalised = text(title);
  if (!normalised) throw new Error('A share card needs a title.');
  for (const char of normalised) {
    if (!font.charToGlyphIndex(char)) {
      throw new Error(
        `The share-card font cannot render ${JSON.stringify(char)}. Set a supported share.title.`,
      );
    }
  }
  const words = normalised.split(' ');
  for (let size = 78; size >= 52; size -= 2) {
    const width = (line) => {
      const box = font.getPath(line, 0, 0, size).getBoundingBox();
      return (
        Math.max(font.getAdvanceWidth(line, size), box.x2) - Math.min(0, box.x1)
      );
    };
    const lines = [];
    let line = '';
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (line && width(candidate) > 1056) {
        lines.push(line);
        line = word;
      } else line = candidate;
    }
    lines.push(line);
    if (lines.length > 4 || lines.some((line) => width(line) > 1056)) continue;
    const lineHeight = size * 1.12;
    const baseline = 146 + (font.ascender / font.unitsPerEm) * size;
    const paths = lines.map((line, i) => {
      const left = font.getPath(line, 0, 0, size).getBoundingBox().x1;
      return font.getPath(
        line,
        72 - Math.min(0, left),
        baseline + i * lineHeight,
        size,
      );
    });
    const boxes = paths.map((path) => path.getBoundingBox());
    if (
      boxes.some(
        (box) => box.x1 < 72 || box.x2 > 1128 || box.y1 < 146 || box.y2 > 450,
      )
    )
      continue;
    return { lines, size, boxes, paths };
  }
  throw new Error(
    `Share title does not fit at a readable size: ${title}. Supply a shorter share.title; titles are never clipped or truncated.`,
  );
}

export function renderCardSvg(
  { title, category, publication, domain },
  assets,
) {
  const bytes = assets.font;
  const font = opentype.parse(
    bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
  );
  const layout = layoutTitle(title, font);
  const outline = (value, x, y, size) => {
    for (const char of value) {
      if (!font.charToGlyphIndex(char))
        throw new Error(`Unsupported share-card glyph: ${char}`);
    }
    const path = font.getPath(value, x, y, size);
    const box = path.getBoundingBox();
    if (box.x1 < 72 || box.x2 > 1128)
      throw new Error('Share-card signature exceeds its margins.');
    return `<path d="${path.toPathData(3)}"/>`;
  };
  const parts = {
    category: outline(category.toUpperCase(), 72, 111, 24),
    title: layout.paths
      .map((path) => `<path d="${path.toPathData(3)}"/>`)
      .join(''),
    portrait: assets.portrait
      .replace(/^.*?<svg\b[^>]*>/s, '')
      .replace(/<\/svg>\s*$/, ''),
    publication: outline(publication, 192, 537, 28),
    domain: outline(domain, 192, 573, 22),
  };
  const svg = assets.template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in parts))
      throw new Error(`Unknown share-card template field: ${key}`);
    return parts[key];
  });
  return {
    svg: svg.replace('<rect ', `<title>${xml(text(title))}</title><rect `),
    layout,
  };
}

export async function createArticleImage(
  data,
  publication,
  origin,
  suppliedAssets,
) {
  if (!isPublishedArticle(data))
    throw new Error('Share images are generated only for published articles.');
  const title = data.share?.title ?? data.title;
  const assets = suppliedAssets ?? (await loadCardAssets());
  let png;
  let source;
  let layout;
  if (data.share?.image) {
    const publicRoot = await realpath('public');
    const path = await realpath(resolve(publicRoot, `.${data.share.image}`));
    if (!path.startsWith(publicRoot + sep))
      throw new Error('Share images must be local files inside public/.');
    source = await readFile(path);
    const metadata = await sharp(source).metadata();
    if (
      !['png', 'jpeg', 'webp'].includes(metadata.format) ||
      (metadata.pages ?? 1) !== 1
    ) {
      throw new Error(
        'A share image override must be a still PNG, JPEG or WebP.',
      );
    }
    png = await sharp(source)
      .rotate()
      .resize(1200, 630, { fit: 'contain', background: '#FAF8F3' })
      .flatten({ background: '#FAF8F3' })
      .removeAlpha()
      .png()
      .toBuffer();
  } else {
    const rendered = renderCardSvg(
      {
        title,
        category: data.articleType,
        publication,
        domain: new URL(origin).host,
      },
      assets,
    );
    layout = rendered.layout;
    source = Buffer.from(rendered.svg);
    png = await sharp(source)
      .flatten({ background: '#FAF8F3' })
      .removeAlpha()
      .png()
      .toBuffer();
  }
  const hash = createHash('sha256');
  // Include original inputs as well as rendered bytes, including changes invisible in a thumbnail.
  for (const input of [
    assets.font,
    assets.portrait,
    assets.template,
    source,
    png,
  ])
    hash.update(input).update('\0');
  const id = hash.digest('hex');
  return {
    id,
    path: `/og/${id}.png`,
    png,
    layout,
    width: 1200,
    height: 630,
    type: 'image/png',
    alt: data.share?.imageAlt ?? `${title} — ${publication}`,
  };
}
