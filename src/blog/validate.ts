/**
 * The content rules for a post. Every rule that fails is reported, so one
 * run of `npm run blog:check` lists everything to fix.
 */
import { FrontmatterError, hasOwn, parseFrontmatter, type FrontValue } from './frontmatter';
import { countWords, linkTargets, renderMarkdown } from './markdown';
import { isTag, LIMITS, READING_SPEED, type Post, type Source, type Tag } from './schema';

/** Today's date in Dubai (UTC+4, no daylight saving), as YYYY-MM-DD. */
export function dubaiToday(now: Date = new Date()): string {
  return new Date(now.getTime() + 4 * 3_600_000).toISOString().slice(0, 10);
}

export const FILE_NAME = /^(\d{4}-\d{2}-\d{2})-([a-z0-9]+(?:-[a-z0-9]+)*)\.md$/;
/** Slugs that would collide with other blog URLs. */
const RESERVED_SLUGS = new Set(['tag', 'feed']);

const KEYS = ['title', 'description', 'date', 'tags', 'sources', 'aiAssisted'] as const;

/** Names that must never appear in a post (case-insensitive). */
const FORBIDDEN: { pattern: RegExp; label: string }[] = [
  { pattern: /emirates/i, label: '"Emirates"' },
  { pattern: /enbd/i, label: '"ENBD"' },
  { pattern: /synechron\s+client/i, label: '"Synechron client"' },
];

const EMAIL = /[\w.+-]+@[\w-]+(?:\.[\w-]+)*\.[a-z]{2,}/i;
/** Digit runs with phone-like separators; the digit count decides (see looksLikePhone). */
const PHONE_CANDIDATE = /(?<![\w.])\+?\(?\d[\d ().-]{6,}\d(?![\w])/g;
const URL_TEXT = /https?:\/\/[^\s)>\]]+/gi;

export function isRealDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

function looksLikePhone(candidate: string): boolean {
  const digits = candidate.replace(/\D/g, '').length;
  if (/^\d+\.\d+$/.test(candidate)) return false; // a decimal number
  if (candidate.startsWith('+')) return digits >= 8 && digits <= 15;
  return digits >= 9 && digits <= 15;
}

/** Problems with personal or client details anywhere in the file. */
export function privacyProblems(text: string): string[] {
  const problems: string[] = [];
  for (const { pattern, label } of FORBIDDEN) {
    if (pattern.test(text)) problems.push(`mentions ${label}, which is not allowed`);
  }
  // Numbers inside URLs (article ids, DOIs) are not phone numbers.
  const prose = text.replace(URL_TEXT, ' ');
  if (EMAIL.test(prose)) problems.push('contains an email address');
  const phone = [...prose.matchAll(PHONE_CANDIDATE)].find((m) => looksLikePhone(m[0].trim()));
  if (phone) problems.push(`contains what looks like a phone number: ${phone[0].trim()}`);
  return problems;
}

function isHttpsUrl(url: string): boolean {
  try {
    return /^https:\/\//.test(url) && new URL(url).protocol === 'https:';
  } catch {
    return false;
  }
}

/** Problems with the Markdown body itself. `firstLine` is the body's line in the file. */
export function bodyProblems(body: string, firstLine = 1): string[] {
  const problems: string[] = [];
  const lines = body.split('\n');

  lines.forEach((line, i) => {
    const at = `line ${firstLine + i}`;
    if (/<[a-zA-Z/]/.test(line)) {
      problems.push(`${at}: raw HTML is not allowed (write &lt; for a literal "<")`);
    }
    if (/!\[[^\]]*\]/.test(line)) problems.push(`${at}: images are not supported`);
    if (/http:\/\//i.test(line)) problems.push(`${at}: http:// URL; use https://`);
    // Also catches targets markdown-it refuses to link at all, such as javascript:.
    if (/\]\(\s*<?(?!https:\/\/)/i.test(line)) {
      problems.push(`${at}: link is not an https:// URL`);
    }
    const text = line.replace(/^\s*(?:>\s*)*(?:[-*+]\s+|\d+[.)]\s+|#{1,6}\s+)?/, '');
    if (/^as an ai\b/i.test(text)) problems.push(`${at}: starts with "As an AI"`);
  });

  for (const href of linkTargets(body)) {
    if (!isHttpsUrl(href)) problems.push(`link is not an https:// URL: ${href || '(empty)'}`);
  }

  const words = countWords(body);
  if (words < LIMITS.WORDS_MIN || words > LIMITS.WORDS_MAX) {
    problems.push(`body has ${words} words; it must have ${LIMITS.WORDS_MIN}–${LIMITS.WORDS_MAX}`);
  }
  return problems;
}

const isString = (v: FrontValue | undefined): v is string => typeof v === 'string';
const length = (s: string) => [...s].length;

export interface CheckedPost {
  post: Post | null;
  errors: string[];
}

/**
 * Checks one file and, if it passes, returns the post with its rendered body.
 * `today` is the latest allowed date (YYYY-MM-DD), Dubai time by default.
 */
export function checkPost(file: string, text: string, today: string = dubaiToday()): CheckedPost {
  const errors: string[] = [];
  const name = FILE_NAME.exec(file);
  if (!name) {
    return {
      post: null,
      errors: ['file name must be YYYY-MM-DD-slug.md (lowercase letters, digits and hyphens)'],
    };
  }
  const [, fileDate = '', slug = ''] = name;
  if (RESERVED_SLUGS.has(slug)) errors.push(`the slug "${slug}" is reserved`);
  if (slug.length > LIMITS.SLUG_MAX)
    errors.push(`slug is longer than ${LIMITS.SLUG_MAX} characters`);

  let parsed;
  try {
    parsed = parseFrontmatter(text);
  } catch (e) {
    const message = e instanceof FrontmatterError ? e.message : String(e);
    return { post: null, errors: [...errors, `front matter: ${message}`] };
  }
  const { data, body, bodyLine } = parsed;

  for (const key of Object.keys(data)) {
    if (!(KEYS as readonly string[]).includes(key))
      errors.push(`unknown front matter key "${key}"`);
  }
  for (const key of KEYS) {
    if (!hasOwn(data, key)) errors.push(`missing front matter key "${key}"`);
  }

  const { title, description, date, tags, sources, aiAssisted } = data;

  if (hasOwn(data, 'title')) {
    if (!isString(title) || title.trim() === '') errors.push('title must be text');
    else if (length(title) > LIMITS.TITLE_MAX) {
      errors.push(`title is ${length(title)} characters; the limit is ${LIMITS.TITLE_MAX}`);
    }
  }

  if (hasOwn(data, 'description')) {
    if (!isString(description)) errors.push('description must be text');
    else if (
      length(description) < LIMITS.DESCRIPTION_MIN ||
      length(description) > LIMITS.DESCRIPTION_MAX
    ) {
      errors.push(
        `description is ${length(description)} characters; it must be ${LIMITS.DESCRIPTION_MIN}–${LIMITS.DESCRIPTION_MAX}`,
      );
    }
  }

  if (hasOwn(data, 'date')) {
    if (!isString(date) || !isRealDate(date)) errors.push('date must be a real date, YYYY-MM-DD');
    else {
      if (date !== fileDate) errors.push(`date ${date} does not match the file name (${fileDate})`);
      if (date > today) errors.push(`date ${date} is in the future (today in Dubai is ${today})`);
    }
  }

  const tagList: Tag[] = [];
  if (hasOwn(data, 'tags')) {
    if (!Array.isArray(tags) || tags.some((t) => typeof t !== 'string')) {
      errors.push('tags must be a list of tag names');
    } else {
      for (const t of tags as string[]) {
        if (!isTag(t)) errors.push(`unknown tag "${t}"`);
        else if (tagList.includes(t)) errors.push(`tag "${t}" is listed twice`);
        else tagList.push(t);
      }
      if (tags.length < LIMITS.TAGS_MIN || tags.length > LIMITS.TAGS_MAX) {
        errors.push(`${tags.length} tags; a post has ${LIMITS.TAGS_MIN}–${LIMITS.TAGS_MAX}`);
      }
    }
  }

  const sourceList: Source[] = [];
  if (hasOwn(data, 'sources')) {
    if (!Array.isArray(sources) || sources.some((s) => typeof s !== 'object')) {
      errors.push('sources must be a list of "title" and "url" pairs');
    } else {
      (sources as Record<string, FrontValue>[]).forEach((s, i) => {
        const n = `source ${i + 1}`;
        const keys = Object.keys(s).sort().join(',');
        if (keys !== 'title,url') errors.push(`${n} must have exactly a title and a url`);
        if (!isString(s['title']) || s['title'].trim() === '') {
          errors.push(`${n} needs a title`);
        }
        if (!isString(s['url']) || !isHttpsUrl(s['url'])) {
          errors.push(`${n} url must be an https:// URL`);
        }
        if (isString(s['title']) && isString(s['url'])) {
          sourceList.push({ title: s['title'], url: s['url'] });
        }
      });
      if (sources.length < LIMITS.SOURCES_MIN) {
        errors.push(`${sources.length} source(s); a post needs at least ${LIMITS.SOURCES_MIN}`);
      }
    }
  }

  if (hasOwn(data, 'aiAssisted') && typeof aiAssisted !== 'boolean') {
    errors.push('aiAssisted must be true or false');
  }

  errors.push(...bodyProblems(body, bodyLine), ...privacyProblems(text));
  // The rule is about lines anywhere in the file, the front matter included.
  if (text.split('\n').some((l, i) => i < bodyLine - 1 && /^\s*\w+:\s*["']?as an ai\b/i.test(l))) {
    errors.push('a front matter value starts with "As an AI"');
  }

  if (errors.length) return { post: null, errors };

  const words = countWords(body);
  return {
    post: {
      file,
      slug,
      title: (title as string).trim(),
      description: (description as string).trim(),
      date: date as string,
      tags: tagList,
      sources: sourceList,
      aiAssisted: aiAssisted as boolean,
      html: renderMarkdown(body),
      words,
      readingMinutes: Math.max(1, Math.round(words / READING_SPEED)),
    },
    errors: [],
  };
}
