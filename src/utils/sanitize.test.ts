import { describe, it, expect } from 'vitest';
import { sanitize } from './sanitize';

describe('sanitize', () => {
  it('returns the same plain text unchanged', () => {
    expect(sanitize('Hello World')).toBe('Hello World');
  });

  it('strips leading and trailing whitespace', () => {
    expect(sanitize('  hello  ')).toBe('hello');
  });

  it('escapes HTML angle brackets so they cannot inject markup', () => {
    // createTextNode in jsdom produces &lt; / &gt; in innerHTML
    const result = sanitize('<script>alert(1)</script>');
    expect(result).not.toContain('<script>');
    expect(result).toContain('&lt;');
  });

  it('truncates to the default max length (5000 chars)', () => {
    const long = 'a'.repeat(6000);
    expect(sanitize(long).length).toBeLessThanOrEqual(5000);
  });

  it('respects a custom maxLength', () => {
    expect(sanitize('abcdef', 3)).toBe('abc');
  });

  it('handles empty string gracefully', () => {
    expect(sanitize('')).toBe('');
  });
});
