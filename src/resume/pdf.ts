import { WIDTHS } from './helvetica';

/**
 * A very small PDF writer: A4 pages, the two built-in Helvetica faces, text,
 * hairlines and web links. Enough for a one-column résumé, in a few kilobytes
 * and with no dependency. Coordinates are in points from the top-left corner.
 */
export type Font = keyof typeof WIDTHS;

export const PAGE = { width: 595.28, height: 841.89 } as const;

/** Characters outside Latin-1 that WinAnsi places in the 0x80–0x9F range. */
const WIN_ANSI: Record<number, number> = {
  0x20ac: 0x80,
  0x2026: 0x85,
  0x2018: 0x91,
  0x2019: 0x92,
  0x201c: 0x93,
  0x201d: 0x94,
  0x2022: 0x95,
  0x2013: 0x96,
  0x2014: 0x97,
};

const UNKNOWN = 0x3f; // "?"

/** Swap characters the built-in fonts cannot show for ones they can. */
function normalise(text: string): string {
  return text
    .replace(/\u00a0/g, ' ')
    .replace(/[\u2011\u2212]/g, '-')
    .replace(/\s*\u2192\s*/g, ' to ');
}

/** WinAnsi bytes for a string; anything unmappable becomes "?". */
export function encode(text: string): number[] {
  const bytes: number[] = [];
  for (const ch of normalise(text)) {
    const cp = ch.codePointAt(0) ?? UNKNOWN;
    if ((cp >= 0x20 && cp <= 0x7e) || (cp >= 0xa0 && cp <= 0xff)) bytes.push(cp);
    else bytes.push(WIN_ANSI[cp] ?? UNKNOWN);
  }
  return bytes;
}

export function textWidth(text: string, font: Font, size: number): number {
  const table = WIDTHS[font];
  let units = 0;
  for (const b of encode(text)) units += table[b - 32] ?? 0;
  return (units * size) / 1000;
}

const num = (n: number) => String(Math.round(n * 100) / 100);
const hex = (bytes: number[]) => bytes.map((b) => b.toString(16).padStart(2, '0')).join('');

/** Text for the document information dictionary: UTF-16BE with a byte-order mark. */
function infoString(text: string): string {
  let out = 'feff';
  for (let i = 0; i < text.length; i += 1) out += text.charCodeAt(i).toString(16).padStart(4, '0');
  return `<${out}>`;
}

const pdfDate = (d: Date) => `(D:${d.toISOString().replace(/[-:T]/g, '').slice(0, 14)}Z)`;

interface Link {
  x: number;
  y: number;
  width: number;
  height: number;
  url: string;
}

export class PdfPage {
  private ops: string[] = [];
  readonly links: Link[] = [];

  /** Draw one line of text with its baseline at `y`. `gray` runs 0 (black) to 1 (white). */
  text(x: number, y: number, value: string, font: Font, size: number, gray = 0): void {
    const face = font === 'bold' ? 'F2' : 'F1';
    this.ops.push(
      `BT /${face} ${num(size)} Tf ${num(gray)} g ${num(x)} ${num(PAGE.height - y)} Td <${hex(encode(value))}> Tj ET`,
    );
  }

  /** A horizontal hairline. */
  rule(x1: number, x2: number, y: number, gray = 0.8, width = 0.5): void {
    const py = num(PAGE.height - y);
    this.ops.push(`${num(gray)} G ${num(width)} w ${num(x1)} ${py} m ${num(x2)} ${py} l S`);
  }

  /** Make a rectangle (given by its top-left corner) open a web address. */
  link(x: number, y: number, width: number, height: number, url: string): void {
    this.links.push({ x, y, width, height, url });
  }

  content(): string {
    return this.ops.join('\n');
  }
}

export interface PdfInfo {
  title: string;
  author: string;
  subject: string;
  created: Date;
}

export class PdfDocument {
  readonly pages: PdfPage[] = [];

  addPage(): PdfPage {
    const page = new PdfPage();
    this.pages.push(page);
    return page;
  }

  /** Serialise to bytes. Every object is plain ASCII, so offsets are string lengths. */
  build(info: PdfInfo): Uint8Array<ArrayBuffer> {
    const objects: string[] = [];
    const add = (body: string) => objects.push(body);
    const CATALOG = 1;
    const PAGES = 2;
    const FIRST_PAGE = 6;

    // Each page takes one object for itself, one for its content, one per link.
    const pageIds: number[] = [];
    let next = FIRST_PAGE;
    for (const p of this.pages) {
      pageIds.push(next);
      next += 2 + p.links.length;
    }

    add(
      `<< /Type /Catalog /Pages ${PAGES} 0 R /Lang (en) /ViewerPreferences << /DisplayDocTitle true >> >>`,
    );
    add(
      `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${this.pages.length} >>`,
    );
    add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
    add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
    add(
      `<< /Title ${infoString(info.title)} /Author ${infoString(info.author)} /Subject ${infoString(info.subject)} /Creator ${infoString('souravsharma.in')} /CreationDate ${pdfDate(info.created)} >>`,
    );

    this.pages.forEach((p, i) => {
      const id = pageIds[i] ?? 0;
      const annots = p.links.map((_, n) => `${id + 2 + n} 0 R`).join(' ');
      const stream = p.content();
      add(
        `<< /Type /Page /Parent ${PAGES} 0 R /MediaBox [0 0 ${PAGE.width} ${PAGE.height}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${id + 1} 0 R /Annots [${annots}] >>`,
      );
      add(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
      for (const l of p.links) {
        const top = PAGE.height - l.y;
        const url = encodeURI(l.url).replace(/[\\()]/g, '\\$&');
        add(
          `<< /Type /Annot /Subtype /Link /Rect [${num(l.x)} ${num(top - l.height)} ${num(l.x + l.width)} ${num(top)}] /Border [0 0 0] /A << /S /URI /URI (${url}) >> >>`,
        );
      }
    });

    let out = '%PDF-1.4\n';
    const offsets: number[] = [];
    objects.forEach((body, i) => {
      offsets.push(out.length);
      out += `${i + 1} 0 obj\n${body}\nendobj\n`;
    });
    const xref = out.length;
    out += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    for (const o of offsets) out += `${String(o).padStart(10, '0')} 00000 n \n`;
    out += `trailer\n<< /Size ${objects.length + 1} /Root ${CATALOG} 0 R /Info 5 0 R >>\nstartxref\n${xref}\n%%EOF\n`;

    const bytes = new Uint8Array(new ArrayBuffer(out.length));
    for (let i = 0; i < out.length; i += 1) bytes[i] = out.charCodeAt(i) & 0xff;
    return bytes;
  }
}
