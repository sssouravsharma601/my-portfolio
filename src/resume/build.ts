import { CAREER_START, education, hiring, profile, roles, skills } from '../data/profile';
import type { Role } from '../types';
import { formatDuration, formatYearMonth, yearsSince } from '../utils/date';
import { PAGE, PdfDocument, type Font, type PdfPage, textWidth } from './pdf';

/**
 * Lays the résumé out from the same data the site renders, as of `now`.
 * It is built in the visitor's browser at the moment they ask for it, so the
 * years of experience and the length of the current role are never stale.
 */
const LEFT = 50;
const RIGHT = PAGE.width - 50;
const WIDTH = RIGHT - LEFT;
const TOP = 58;
const BOTTOM = PAGE.height - 58;

const INK = 0.1;
const SOFT = 0.36;
const LINE = 0.82;

const SITE = 'https://souravsharma.in/';

/** The opening paragraph, assembled from statements the site already makes. */
export function summary(years: number): string {
  return (
    `Senior frontend engineer in Dubai with ${years} years of experience, mostly in React and TypeScript. ` +
    'I build frontends for complicated systems: a bank’s rule engine, live classes for millions of students, a launch-day checkout. ' +
    'I lead four engineers across frontend and backend today, and led five frontend engineers at BYJU’S.'
  );
}

const longDate = (d: Date) =>
  new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);

function wrap(text: string, font: Font, size: number, width: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && textWidth(candidate, font, size) > width) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

interface TextStyle {
  font?: Font;
  size?: number;
  gray?: number;
  /** Line height as a multiple of the font size. */
  lead?: number;
  x?: number;
  width?: number;
}

class Flow {
  page: PdfPage;
  /** Baseline of the next line, measured from the top of the page. */
  y = TOP;

  constructor(private doc: PdfDocument) {
    this.page = doc.addPage();
  }

  /** Start a new page unless `height` more points fit on this one. */
  need(height: number): void {
    if (this.y + height > BOTTOM) {
      this.page = this.doc.addPage();
      this.y = TOP;
    }
  }

  gap(points: number): void {
    this.y += points;
  }

  paragraph(text: string, style: TextStyle = {}): void {
    const { font = 'regular', size = 10, gray = INK, lead = 1.4, x = LEFT } = style;
    const width = style.width ?? RIGHT - x;
    for (const line of wrap(text, font, size, width)) {
      this.need(size * lead);
      this.page.text(x, this.y, line, font, size, gray);
      this.y += size * lead;
    }
  }

  /** A small capitals heading with a hairline under it. */
  heading(text: string): void {
    this.need(64);
    this.gap(10);
    this.page.text(LEFT, this.y, text.toUpperCase(), 'bold', 8.5, SOFT);
    this.page.rule(LEFT, RIGHT, this.y + 5, LINE);
    this.y += 20;
  }

  bullet(text: string): void {
    const size = 10;
    const lines = wrap(text, 'regular', size, WIDTH - 12);
    lines.forEach((line, i) => {
      this.need(size * 1.4);
      if (i === 0) this.page.text(LEFT, this.y, '•', 'regular', size, SOFT);
      this.page.text(LEFT + 12, this.y, line, 'regular', size, INK);
      this.y += size * 1.4;
    });
    this.gap(1.5);
  }

  /** A bold label in a fixed column with its value wrapping beside it. */
  pair(label: string, value: string, column = 92): void {
    const size = 10;
    const lines = wrap(value, 'regular', size, WIDTH - column);
    this.need(size * 1.4 * lines.length);
    this.page.text(LEFT, this.y, label, 'bold', size, INK);
    for (const line of lines) {
      this.page.text(LEFT + column, this.y, line, 'regular', size, INK);
      this.y += size * 1.4;
    }
    this.gap(2);
  }
}

function header(flow: Flow): void {
  const { page } = flow;
  page.text(LEFT, flow.y + 8, profile.name, 'bold', 24, INK);
  flow.y += 26;
  page.text(LEFT, flow.y, `${profile.title} · ${profile.location}`, 'regular', 11, SOFT);
  flow.y += 18;

  const contacts = [
    { text: profile.email, url: `mailto:${profile.email}` },
    { text: profile.phone.display, url: profile.phone.href },
    { text: 'souravsharma.in', url: SITE },
    {
      text: profile.linkedin.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, ''),
      url: profile.linkedin,
    },
    { text: profile.github.replace(/^https:\/\//, ''), url: profile.github },
  ];
  const size = 9.5;
  const separator = '   ·   ';
  // Two lines: how to reach him, then where to read more.
  for (const line of [contacts.slice(0, 3), contacts.slice(3)]) {
    let x = LEFT;
    line.forEach((c, i) => {
      if (i > 0) {
        page.text(x, flow.y, separator, 'regular', size, SOFT);
        x += textWidth(separator, 'regular', size);
      }
      const w = textWidth(c.text, 'regular', size);
      page.text(x, flow.y, c.text, 'regular', size, INK);
      page.link(x, flow.y - size, w, size * 1.3, c.url);
      x += w;
    });
    flow.y += size * 1.5;
  }
  flow.y += 2;
}

/** Height of a role block, so a role is never split across two pages. */
function roleHeight(r: Role): number {
  const body = (text: string, width: number) => wrap(text, 'regular', 10, width).length * 14;
  const bullets = r.highlights.reduce((sum, h) => sum + body(h, WIDTH - 12) + 1.5, 0);
  const stack = wrap(r.stack.join('  ·  '), 'regular', 9, WIDTH).length * 12.6;
  return 14 + 15 + body(r.summary, WIDTH) + 3 + bullets + 1 + stack;
}

function role(flow: Flow, r: Role, now: Date): void {
  flow.need(roleHeight(r));
  const { page } = flow;
  const dates = `${formatYearMonth(r.start)} – ${r.end ? formatYearMonth(r.end) : 'Present'}`;
  const length = formatDuration(r.start, r.end, now);

  page.text(LEFT, flow.y, r.company, 'bold', 11.5, INK);
  if (r.context) {
    const x = LEFT + textWidth(r.company, 'bold', 11.5) + 5;
    page.text(x, flow.y, r.context, 'regular', 10, SOFT);
  }
  page.text(RIGHT - textWidth(dates, 'regular', 9.5), flow.y, dates, 'regular', 9.5, SOFT);
  flow.y += 14;

  page.text(LEFT, flow.y, r.title, 'regular', 10, INK);
  page.text(RIGHT - textWidth(length, 'regular', 9.5), flow.y, length, 'regular', 9.5, SOFT);
  flow.y += 15;

  flow.paragraph(r.summary, { gray: 0.22 });
  flow.gap(3);
  for (const h of r.highlights) flow.bullet(h);
  flow.gap(1);
  flow.paragraph(r.stack.join('  ·  '), { size: 9, gray: SOFT });
  flow.gap(11);
}

function footers(doc: PdfDocument, now: Date): void {
  const size = 8;
  const y = PAGE.height - 34;
  const stamp = `Generated from souravsharma.in on ${longDate(now)}`;
  doc.pages.forEach((page, i) => {
    page.rule(LEFT, RIGHT, y - 12, LINE);
    page.text(LEFT, y, stamp, 'regular', size, SOFT);
    page.link(LEFT, y - size, textWidth(stamp, 'regular', size), size * 1.3, SITE);
    const count = `Page ${i + 1} of ${doc.pages.length}`;
    page.text(RIGHT - textWidth(count, 'regular', size), y, count, 'regular', size, SOFT);
  });
}

export const RESUME_FILE_NAME = `${profile.name.replace(/\s+/g, '-')}-Resume.pdf`;

export function buildResume(now: Date = new Date()): Uint8Array<ArrayBuffer> {
  const doc = new PdfDocument();
  const flow = new Flow(doc);

  header(flow);

  flow.heading('Summary');
  flow.paragraph(summary(yearsSince(CAREER_START, now)), { lead: 1.45 });

  flow.heading('Experience');
  for (const r of roles) role(flow, r, now);
  flow.gap(-11);

  flow.heading('Skills');
  for (const g of skills) flow.pair(g.title, g.items.join(', '));

  flow.heading('Education');
  for (const d of education) flow.pair(d.year, `${d.title}, ${d.school}`, 44);

  flow.heading('Details');
  for (const h of hiring) flow.pair(h.label, h.value);

  footers(doc, now);

  return doc.build({
    title: `${profile.name}, ${profile.title}`,
    author: profile.name,
    subject: 'Résumé',
    created: now,
  });
}
