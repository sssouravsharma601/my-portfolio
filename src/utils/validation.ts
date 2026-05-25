import { VALIDATION } from '../constants';
import type { FormData, FormErrors } from '../types';

// ── Primitive validators ──────────────────────────────────────────────────────

/**
 * RFC 5321-ish e-mail check.
 * – Local part  ≤ 64 characters
 * – Total length ≤ 254 characters
 * – No whitespace, must have exactly one @, TLD ≥ 2 characters
 */
export function isValidEmail(email: string): boolean {
  const trimmed = email.trim();
  if (trimmed.length > VALIDATION.EMAIL_TOTAL_MAX) return false;
  const [local, ...rest] = trimmed.split('@');
  if (rest.length !== 1) return false; // zero or multiple @
  if ((local?.length ?? 0) > VALIDATION.EMAIL_LOCAL_MAX) return false;
  return /^[^\s@]{1,64}@[^\s@]+\.[^\s@]{2,}$/.test(trimmed);
}

/** True when the trimmed string meets the required minimum length. */
export function isMinLength(value: string, min: number): boolean {
  return value.trim().length >= min;
}

/** True when the string is non-empty after trimming. */
export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

// ── Form-level validator ──────────────────────────────────────────────────────

/**
 * Validates all contact-form fields and returns a `FormErrors` map.
 * An empty object means the form is valid.
 */
export function validateContactForm(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!isMinLength(data.name, VALIDATION.NAME_MIN_LENGTH)) {
    errors.name = `Please enter your full name (at least ${VALIDATION.NAME_MIN_LENGTH} characters).`;
  }

  if (!isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!isMinLength(data.subject, VALIDATION.SUBJECT_MIN_LENGTH)) {
    errors.subject = `Please enter a subject (at least ${VALIDATION.SUBJECT_MIN_LENGTH} characters).`;
  }

  if (!isMinLength(data.message, VALIDATION.MESSAGE_MIN_LENGTH)) {
    errors.message = `Please write a message (at least ${VALIDATION.MESSAGE_MIN_LENGTH} characters).`;
  }

  return errors;
}
