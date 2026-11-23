import { describe, expect, it } from 'vitest';
import { profile, roles } from '../data/profile';
import { formatDuration } from '../utils/date';
import { buildResume, RESUME_FILE_NAME } from './build';
import { encode, PdfDocument, textWidth } from './pdf';

const NOW = new Date(2026, 10, 17);

/** The file is plain ASCII by construction, so bytes map straight to characters. */
const asText = (bytes: Uint8Array) => Array.from(bytes, (b) => String.fromCharCode(b)).join('');

/** Every string a page draws, decoded from the hex form it is written in. */
function drawn(pdf: string): string {
  return Array.from(pdf.matchAll(/<([0-9a-f]*)> Tj/g))
    .map((m) =>
      (m[1]?.match(/../g) ?? []).map((h) => String.fromCharCode(parseInt(h, 16))).join(''),
    )
    .join('\n');
}

describe('PDF writer', () => {
  it('measures text with the Helvetica metrics', () => {
    // H 722 + e 556 + l 222 + l 222 + o 556 = 2278 thousandths of 10pt
    expect(textWidth('Hello', 'regular', 10)).toBeCloseTo(22.78, 5);
    expect(textWidth('Hello', 'bold', 10)).toBeGreaterThan(22.78);
  });

  it('maps typographic characters into WinAnsi and replaces what it cannot show', () => {
    expect(encode('BYJU\u2019S')).toEqual([0x42, 0x59, 0x4a, 0x55, 0x92, 0x53]);
    expect(encode('2018 \u2013 2021')).toContain(0x96);
    expect(String.fromCharCode(...encode('52\u219291'))).toBe('52 to 91');
    expect(String.fromCharCode(...encode('\u221235%'))).toBe('-35%');
  });

  it('writes a cross-reference table whose offsets land on their objects', () => {
    const doc = new PdfDocument();
    const page = doc.addPage();
    page.text(50, 60, 'Hello', 'regular', 12);
    page.link(50, 50, 30, 12, 'https://example.com/a (b)');
    const pdf = asText(doc.build({ title: 'T', author: 'A', subject: 'S', created: new Date(0) }));

    expect(pdf.startsWith('%PDF-1.4\n')).toBe(true);
    expect(pdf.endsWith('%%EOF\n')).toBe(true);

    const xrefAt = Number(/startxref\n(\d+)\n/.exec(pdf)?.[1]);
    expect(pdf.slice(xrefAt, xrefAt + 4)).toBe('xref');

    const offsets = Array.from(pdf.slice(xrefAt).matchAll(/^(\d{10}) 00000 n $/gm)).map((m) =>
      Number(m[1]),
    );
    expect(offsets.length).toBeGreaterThan(5);
    offsets.forEach((offset, i) => {
      expect(pdf.slice(offset).startsWith(`${i + 1} 0 obj\n`)).toBe(true);
    });

    // Parentheses in a link are escaped so they cannot end the string early.
    expect(pdf).toContain('/URI (https://example.com/a%20\\(b\\))');
  });
});

describe('résumé', () => {
  const pdf = asText(buildResume(NOW));
  const text = drawn(pdf);

  it('is built from the site data', () => {
    expect(text).toContain(profile.name);
    expect(text).toContain(profile.email);
    for (const r of roles) expect(text).toContain(r.title);
    expect(pdf).toContain(`/URI (mailto:${profile.email})`);
    expect(pdf).toContain(`/URI (${profile.linkedin})`);
    expect(pdf).toContain(`/URI (${profile.github})`);
    expect(RESUME_FILE_NAME).toBe('Sourav-Sharma-Resume.pdf');
  });

  it('shows no character the fonts could not draw', () => {
    expect(text).not.toContain('?');
  });

  it('is dated: the same data gives different figures on a later day', () => {
    const current = roles.find((r) => !r.end);
    expect(current).toBeDefined();
    if (!current) return;

    expect(text).toContain(formatDuration(current.start, undefined, NOW));
    expect(text).toContain('with 8+ years of experience');
    expect(text).toContain('17 November 2026');

    const later = new Date(2027, 5, 1);
    const laterText = drawn(asText(buildResume(later)));
    const before = formatDuration(current.start, undefined, NOW);
    const after = formatDuration(current.start, undefined, later);
    expect(after).not.toBe(before);
    expect(laterText).toContain(after);
    expect(laterText).toContain('with 9+ years of experience');
    expect(laterText).toContain('1 June 2027');
  });

  it('keeps every page inside A4 and numbers them', () => {
    const pages = pdf.match(/\/Type \/Page /g)?.length ?? 0;
    expect(pages).toBeGreaterThanOrEqual(1);
    expect(pages).toBeLessThanOrEqual(2);
    expect(text).toContain(`Page ${pages} of ${pages}`);
  });
});
