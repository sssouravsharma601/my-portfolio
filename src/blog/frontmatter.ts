/**
 * A deliberately small, strict reader for the front matter of a post: the
 * subset of YAML that content/blog/README.md documents, and nothing else.
 *
 *   key: value              plain, "double-quoted" or 'single-quoted'; true / false
 *   key: [one, two]         inline list of scalars
 *   key:                    block list of scalars …
 *     - one
 *   key:                    … or of small maps
 *     - title: Something
 *       url: https://example.com
 *
 * Anything else (tabs, nesting, anchors, multi-line strings, comments) is an
 * error, so a typo fails the build instead of being read some other way.
 */

export type Scalar = string | boolean;
export type FrontValue = Scalar | Scalar[] | Record<string, Scalar>[];

export interface Parsed {
  data: Record<string, FrontValue>;
  body: string;
  /** 1-based line of the file where the body starts. */
  bodyLine: number;
}

export const hasOwn = (o: object, key: string): boolean =>
  Object.prototype.hasOwnProperty.call(o, key);

export class FrontmatterError extends Error {
  constructor(
    message: string,
    readonly line: number,
  ) {
    super(`line ${line}: ${message}`);
    this.name = 'FrontmatterError';
  }
}

const KEY = /^([A-Za-z][A-Za-z0-9]*):(?: (.*))?$/;
const ITEM = /^ {2}- (.*)$/;
const ITEM_KEY = /^([A-Za-z][A-Za-z0-9]*):(?: (.*))?$/;
const ITEM_CONT = /^ {4}([A-Za-z][A-Za-z0-9]*):(?: (.*))?$/;

/** Characters that start something other than a plain string in YAML. */
const RESERVED_START = /^[[\]{}&*!|>%@`#,?-]/;

export function parseScalar(raw: string, line: number): Scalar {
  const s = raw.trim();
  if (s === '') throw new FrontmatterError('empty value', line);
  if (s.startsWith('"')) {
    if (s.length < 2 || !s.endsWith('"')) throw new FrontmatterError('unclosed "quote"', line);
    try {
      return JSON.parse(s) as string;
    } catch {
      throw new FrontmatterError('bad escape in "double-quoted" value', line);
    }
  }
  if (s.startsWith("'")) {
    const inner = s.slice(1, -1);
    if (s.length < 2 || !s.endsWith("'") || /'(?!')/.test(inner.replace(/''/g, ''))) {
      throw new FrontmatterError("unclosed 'quote' (write '' for a quote inside)", line);
    }
    return inner.replace(/''/g, "'");
  }
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (RESERVED_START.test(s) || s.includes(': ') || s.includes(' #')) {
    throw new FrontmatterError(`put this value in "double quotes": ${s}`, line);
  }
  return s;
}

/** `[a, "b, c", d]` → ['a', 'b, c', 'd'] */
function parseInlineList(raw: string, line: number): Scalar[] {
  const inner = raw.trim().slice(1, -1);
  if (inner.trim() === '') return [];
  const items: string[] = [];
  let current = '';
  let quote: string | null = null;
  for (const ch of inner) {
    if (quote) {
      if (ch === quote) quote = null;
      current += ch;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
      current += ch;
    } else if (ch === ',') {
      items.push(current);
      current = '';
    } else if (ch === '[' || ch === ']' || ch === '{' || ch === '}') {
      throw new FrontmatterError('nested lists are not supported', line);
    } else {
      current += ch;
    }
  }
  if (quote) throw new FrontmatterError('unclosed quote in list', line);
  items.push(current);
  return items.map((item) => parseScalar(item, line));
}

function parseValue(raw: string, line: number): FrontValue {
  const s = raw.trim();
  if (s.startsWith('[')) {
    if (!s.endsWith(']')) throw new FrontmatterError('unclosed [list]', line);
    return parseInlineList(s, line);
  }
  return parseScalar(s, line);
}

/** Splits `---` front matter from the body and reads it. Throws FrontmatterError. */
export function parseFrontmatter(text: string): Parsed {
  const unmarked = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text; // byte order mark
  const lines = unmarked.replace(/\r\n?/g, '\n').split('\n');
  if (lines[0] !== '---') throw new FrontmatterError('the file must start with a --- line', 1);
  const end = lines.indexOf('---', 1);
  if (end === -1) throw new FrontmatterError('front matter is not closed with a --- line', 1);

  const data: Record<string, FrontValue> = {};
  let i = 1;
  while (i < end) {
    const lineNo = i + 1;
    const line = lines[i] ?? '';
    if (line.includes('\t')) throw new FrontmatterError('use spaces, not tabs', lineNo);
    if (line.trim() === '') {
      i++;
      continue;
    }
    const m = KEY.exec(line);
    if (!m) throw new FrontmatterError(`expected "key: value", found: ${line.trim()}`, lineNo);
    const key = m[1] ?? '';
    if (hasOwn(data, key)) throw new FrontmatterError(`"${key}" is set twice`, lineNo);
    const inline = m[2] ?? '';
    i++;
    if (inline.trim() !== '') {
      data[key] = parseValue(inline, lineNo);
      continue;
    }

    // A block list: "  - item" lines, maps continuing on "    key: value" lines.
    const scalars: Scalar[] = [];
    const maps: Record<string, Scalar>[] = [];
    while (i < end) {
      const itemLine = lines[i] ?? '';
      const itemNo = i + 1;
      if (itemLine.includes('\t')) throw new FrontmatterError('use spaces, not tabs', itemNo);
      if (itemLine.trim() === '') {
        i++;
        continue;
      }
      if (!itemLine.startsWith(' ')) break;
      const item = ITEM.exec(itemLine);
      if (!item) {
        throw new FrontmatterError('list items are written "  - value" (two spaces)', itemNo);
      }
      const content = item[1] ?? '';
      const pair = ITEM_KEY.exec(content);
      i++;
      if (pair && !content.startsWith('"') && !content.startsWith("'")) {
        if (scalars.length) throw new FrontmatterError('mixed list items', itemNo);
        const map: Record<string, Scalar> = {};
        const add = (k: string, v: string | undefined, n: number) => {
          if (hasOwn(map, k)) throw new FrontmatterError(`"${k}" is set twice`, n);
          map[k] = parseScalar(v ?? '', n);
        };
        add(pair[1] ?? '', pair[2], itemNo);
        while (i < end) {
          const cont = ITEM_CONT.exec(lines[i] ?? '');
          if (!cont) break;
          add(cont[1] ?? '', cont[2], i + 1);
          i++;
        }
        maps.push(map);
      } else {
        if (maps.length) throw new FrontmatterError('mixed list items', itemNo);
        scalars.push(parseScalar(content, itemNo));
      }
    }
    if (!scalars.length && !maps.length) {
      throw new FrontmatterError(`"${key}" has no value`, lineNo);
    }
    data[key] = maps.length ? maps : scalars;
  }

  return { data, body: lines.slice(end + 1).join('\n'), bodyLine: end + 2 };
}
