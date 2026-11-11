import { siteOrigin } from './site.mjs';

export const author = {
  // Keep the existing frontmatter attribution key when changing the public name.
  id: 'Ben',
  name: 'Ben Dennis',
  handle: 'theaussiepom',
  aboutPath: '/about/',
  github: 'https://github.com/theaussiepom',
  linkedin: 'https://www.linkedin.com/in/theaussiepom/',
  portraitAlt: 'Ben Dennis at the beach',
  shortBio:
    'I’m a software engineer, AI enthusiast, homelab tinkerer and passionate gourmet cook. I like learning how things work, questioning assumptions and finding practical ways through complex problems. I prefer to start with a small working version, prove the idea and build from there. Away from the keyboard, I enjoy good coffee, Shiraz and Guinness.',
};

export const aboutParagraphs = [
  'I’m Ben Dennis, a software engineer with a British background and a home on Australia’s Gold Coast. Online, I’m usually theaussiepom. The name is a nod to both places; what I write here is mostly about the things I’m curious enough to explore.',
  'That curiosity took me from wanting to automate a garage door to Home Assistant, networking and a growing collection of self-hosted services. The more I learnt, the more I realised there was still to understand. I also found a community of people asking many of the same questions.',
  'I’ve learnt a huge amount from the community over the years. This blog is one way to give something back.',
  'The Aussie Pom gives those interests a place to meet. It’s still early days here, starting with my homelab journey. Expect software, systems, AI, homelabs, architecture and experiments, alongside other subjects that catch my attention. Some articles will offer an approachable way into a topic. Others will work through a decision, or follow the evidence behind a problem.',
  'I like challenging conventional thinking, but I also want a practical result. I prefer to start with a small working version, prove the idea and build from there. Complexity has to earn its place, particularly when I’m the person who’ll be maintaining it.',
  'When I write about a setup, I want to explain why I chose it, what I’ve checked and what remains uncertain. Your circumstances may be different. The useful part is having enough context to make a decision about your own.',
  'Away from the keyboard, you’ll find me experimenting with gourmet cooking, enjoying a good coffee, a great Shiraz or a pint of Guinness. Whether it’s technology or food, I’m always keen to try something new.',
];

export const isSiteAuthor = (name) =>
  name === author.id || name === author.name;

export function resolveAuthor(
  entry,
  origin = process.env.SITE_URL || siteOrigin,
) {
  return isSiteAuthor(entry.name)
    ? {
        ...entry,
        name: author.name,
        url: new URL(author.aboutPath, origin).href,
      }
    : entry;
}
