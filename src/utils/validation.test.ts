import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  isMinLength,
  isNonEmpty,
  validateContactForm,
} from './validation';

// ── isValidEmail ──────────────────────────────────────────────────────────────

describe('isValidEmail', () => {
  it('accepts a standard email', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
  });

  it('accepts subdomains', () => {
    expect(isValidEmail('user@mail.example.co.uk')).toBe(true);
  });

  it('accepts plus-addressing', () => {
    expect(isValidEmail('user+tag@example.com')).toBe(true);
  });

  it('rejects missing @', () => {
    expect(isValidEmail('userexample.com')).toBe(false);
  });

  it('rejects multiple @', () => {
    expect(isValidEmail('a@b@c.com')).toBe(false);
  });

  it('rejects whitespace inside', () => {
    expect(isValidEmail('user @example.com')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(isValidEmail('')).toBe(false);
  });

  it('rejects TLD shorter than 2 chars', () => {
    expect(isValidEmail('user@example.c')).toBe(false);
  });

  it('rejects local part exceeding 64 chars', () => {
    const local = 'a'.repeat(65);
    expect(isValidEmail(`${local}@example.com`)).toBe(false);
  });

  it('rejects total length exceeding 254 chars', () => {
    const local = 'a'.repeat(200);
    expect(isValidEmail(`${local}@example.com`)).toBe(false);
  });
});

// ── isMinLength ───────────────────────────────────────────────────────────────

describe('isMinLength', () => {
  it('returns true when trimmed length meets minimum', () => {
    expect(isMinLength('ab', 2)).toBe(true);
  });

  it('returns false when trimmed length is below minimum', () => {
    expect(isMinLength('a', 2)).toBe(false);
  });

  it('trims whitespace before checking', () => {
    expect(isMinLength('  a  ', 2)).toBe(false);
    expect(isMinLength('  ab  ', 2)).toBe(true);
  });
});

// ── isNonEmpty ────────────────────────────────────────────────────────────────

describe('isNonEmpty', () => {
  it('returns true for a non-blank string', () => {
    expect(isNonEmpty('hello')).toBe(true);
  });

  it('returns false for an empty string', () => {
    expect(isNonEmpty('')).toBe(false);
  });

  it('returns false for whitespace-only string', () => {
    expect(isNonEmpty('   ')).toBe(false);
  });
});

// ── validateContactForm ───────────────────────────────────────────────────────

describe('validateContactForm', () => {
  const valid = {
    name:    'Sourav Sharma',
    email:   'user@example.com',
    subject: 'Hello there',
    message: 'This is a test message long enough.',
  };

  it('returns empty errors object for a fully valid form', () => {
    expect(validateContactForm(valid)).toEqual({});
  });

  it('reports name error when name is too short', () => {
    const result = validateContactForm({ ...valid, name: 'A' });
    expect(result.name).toBeDefined();
    expect(result.email).toBeUndefined();
  });

  it('reports email error for invalid email', () => {
    const result = validateContactForm({ ...valid, email: 'not-an-email' });
    expect(result.email).toBeDefined();
  });

  it('reports subject error when subject is too short', () => {
    const result = validateContactForm({ ...valid, subject: 'ab' });
    expect(result.subject).toBeDefined();
  });

  it('reports message error when message is too short', () => {
    const result = validateContactForm({ ...valid, message: 'short' });
    expect(result.message).toBeDefined();
  });

  it('can report multiple errors simultaneously', () => {
    const result = validateContactForm({
      name:    '',
      email:   '',
      subject: '',
      message: '',
    });
    expect(Object.keys(result)).toHaveLength(4);
  });
});
