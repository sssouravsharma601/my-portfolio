import { VALIDATION } from '../constants';

/**
 * Trims surrounding whitespace and caps the length of a contact-form field.
 *
 * Deliberately does NOT escape or strip HTML: the values only ever travel as
 * JSON (Formspree) or as a URL-encoded mailto draft and are never rendered as
 * markup, so escaping would just corrupt text such as "R&D" or "a < b".
 */
export function cleanField(input: string, maxLength: number = VALIDATION.FIELD_MAX_LEN): string {
  return input.trim().slice(0, maxLength);
}
