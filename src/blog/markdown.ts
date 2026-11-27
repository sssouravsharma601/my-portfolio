/**
 * Markdown → HTML for blog posts. Build time only: nothing here reaches the
 * browser bundle.
 *
 * Raw HTML is never passed through (`html: false` escapes it, and the content
 * check rejects it before that), bare URLs are not turned into links, images
 * are switched off (the CSP only allows same-origin images), and no element
 * gets a style attribute (the CSP would block it), so table alignment becomes
 * a class instead.
 */
import MarkdownIt from 'markdown-it';
import type Token from 'markdown-it/lib/token.mjs';
import { isExternal } from './schema';

/** Ids the page itself uses; a heading never takes one of these. */
const RESERVED_IDS = ['top', 'main', 'root', 'post-title', 'sources', 'palette-list'];

export function slugify(text: string): string {
  return (
    text
      .normalize('NFKD')
      .replace(/\p{M}/gu, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 64)
      .replace(/-+$/, '') || 'section'
  );
}

const inlineText = (token: Token | undefined): string =>
  (token?.children ?? [])
    .filter((c) => c.type === 'text' || c.type === 'code_inline')
    .map((c) => c.content)
    .join('');

function walk(tokens: Token[], visit: (t: Token) => void): void {
  for (const t of tokens) {
    visit(t);
    if (t.children) walk(t.children, visit);
  }
}

function create(): MarkdownIt {
  const md = new MarkdownIt({ html: false, linkify: false, typographer: true });
  md.disable(['image']);

  md.core.ruler.push('blog_headings_and_attrs', (state) => {
    const used = new Set(RESERVED_IDS);
    const tokens = state.tokens;
    tokens.forEach((t, i) => {
      if (t.type === 'heading_open') {
        // The post title is the page's only h1; a "# Heading" in the body becomes an h2.
        if (t.tag === 'h1') {
          t.tag = 'h2';
          const close = tokens.slice(i).find((c) => c.type === 'heading_close');
          if (close) close.tag = 'h2';
        }
        const base = slugify(inlineText(tokens[i + 1]));
        let id = base;
        for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
        used.add(id);
        t.attrSet('id', id);
      }
    });
    walk(tokens, (t) => {
      if (!t.attrs) return;
      const style = t.attrGet('style');
      if (style === null) return;
      t.attrs = t.attrs.filter(([name]) => name !== 'style');
      const align = /text-align:\s*(left|center|right)/.exec(style)?.[1];
      if (align) t.attrJoin('class', `align-${align}`);
    });
  });

  const renderLink = md.renderer.rules['link_open'];
  md.renderer.rules['link_open'] = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    if (token && isExternal(token.attrGet('href') ?? '')) {
      token.attrSet('rel', 'noopener noreferrer');
    }
    return renderLink
      ? renderLink(tokens, idx, options, env, self)
      : self.renderToken(tokens, idx, options);
  };

  return md;
}

const md = create();

export function renderMarkdown(source: string): string {
  return md.render(source);
}

/** Every link target in the body, as markdown-it resolves them (inline and reference links). */
export function linkTargets(source: string): string[] {
  const hrefs: string[] = [];
  walk(md.parse(source, {}), (t) => {
    if (t.type === 'link_open') hrefs.push(t.attrGet('href') ?? '');
  });
  return hrefs;
}

/** The words a reader reads: text and code, not link targets or Markdown syntax. */
export function countWords(source: string): number {
  let text = '';
  walk(md.parse(source, {}), (t) => {
    if (t.type === 'text' || t.type === 'code_inline') text += ` ${t.content}`;
    else if (t.type === 'fence' || t.type === 'code_block') text += ` ${t.content}`;
    else if (t.type === 'softbreak' || t.type === 'hardbreak') text += ' ';
  });
  return text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}
