import { describe, it, expect } from 'vitest';
import { cleanField } from './cleanField';

describe('cleanField', () => {
  it('returns the same plain text unchanged', () => {
    expect(cleanField('Hello World')).toBe('Hello World');
  });

  it('strips leading and trailing whitespace', () => {
    expect(cleanField('  hello  ')).toBe('hello');
  });

  it('leaves &, <, > and quotes exactly as typed', () => {
    expect(cleanField(`Q&A <b> R&D "quoted" it's`)).toBe(`Q&A <b> R&D "quoted" it's`);
  });

  it('truncates to the default max length (5000 chars)', () => {
    expect(cleanField('a'.repeat(6000))).toHaveLength(5000);
  });

  it('respects a custom maxLength', () => {
    expect(cleanField('abcdef', 3)).toBe('abc');
  });

  it('handles empty string gracefully', () => {
    expect(cleanField('')).toBe('');
  });
});
