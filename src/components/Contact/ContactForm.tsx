import { useState, type FormEvent, type ChangeEvent } from 'react';
import type { FormData, FormErrors } from '../../types';
import { validateContactForm } from '../../utils/validation';
import { sanitize } from '../../utils/sanitize';
import { sendContactForm } from '../../services/contact.service';
import { OWNER_EMAIL } from '../../constants';
import styles from './Contact.module.css';

const EMPTY_FORM: FormData = { name: '', email: '', subject: '', message: '' };

export default function ContactForm() {
  const [form, setForm]           = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors]       = useState<FormErrors>({});
  const [honeypot, setHoneypot]   = useState('');
  const [sending, setSending]     = useState(false);
  const [sent, setSent]           = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const update =
    (field: keyof FormData) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      // Clear field-level error on change so the user gets immediate feedback
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (honeypot) return; // silent bot trap

    const errs = validateContactForm(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSending(true);
    setSendError(null);

    void sendContactForm(form).then((result) => {
      setSending(false);
      if (result.ok) {
        setSent(true);
      } else {
        setSendError(result.error);
      }
    });
  };

  if (sent) {
    const mailtoHref = [
      `mailto:${OWNER_EMAIL}`,
      `?subject=${encodeURIComponent(sanitize(form.subject))}`,
      `&body=${encodeURIComponent(
        `From: ${sanitize(form.name)} <${sanitize(form.email)}>\n\n${sanitize(form.message)}`,
      )}`,
    ].join('');

    return (
      <div className={styles.success} role="status" aria-live="polite">
        <div className={styles.successIcon}>🎉</div>
        <h3>Message Sent!</h3>
        <p>Thanks for reaching out. I&apos;ll reply within 24–48 hours to the email you provided.</p>
        <a href={mailtoHref} className={styles.mailtoLink} rel="noopener noreferrer">
          Or open your email client →
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Contact form"
      className={styles.form}
    >
      {/* Honeypot — visually hidden, traps bots that fill every input */}
      <div
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}
      >
        <label htmlFor="hp">Leave this blank</label>
        <input
          id="hp"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className={styles.row}>
        <Field
          id="name"
          label="Full Name"
          error={errors.name}
          type="text"
          value={form.name}
          onChange={update('name')}
          placeholder="Your name"
          autoComplete="name"
        />
        <Field
          id="email"
          label="Email Address"
          error={errors.email}
          type="email"
          value={form.email}
          onChange={update('email')}
          placeholder="you@example.com"
          autoComplete="email"
        />
      </div>

      <Field
        id="subject"
        label="Subject"
        error={errors.subject}
        type="text"
        value={form.subject}
        onChange={update('subject')}
        placeholder="Job opportunity / Collaboration / Other"
      />

      <TextareaField
        id="message"
        label="Message"
        error={errors.message}
        value={form.message}
        onChange={update('message')}
        placeholder="Tell me about the opportunity…"
      />

      {sendError && (
        <p className={styles.err} role="alert">
          {sendError}
        </p>
      )}

      <button
        type="submit"
        className={`${styles.submit} ${sending ? styles.busy : ''}`}
        disabled={sending}
      >
        {sending ? 'Sending…' : 'Send Message ✈️'}
      </button>
    </form>
  );
}

// ── Local sub-components ──────────────────────────────────────────────────────

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  autoComplete?: string;
}

function Field({ id, label, error, type, value, onChange, placeholder, autoComplete }: FieldProps) {
  return (
    <div className={styles.group}>
      <label className={styles.label} htmlFor={id}>
        {label} <span aria-hidden="true">*</span>
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`${styles.input} ${error ? styles.inputErr : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
      />
      {error && (
        <span id={`${id}-err`} className={styles.err} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

interface TextareaProps {
  id: string;
  label: string;
  error?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
}

function TextareaField({ id, label, error, value, onChange, placeholder }: TextareaProps) {
  return (
    <div className={styles.group}>
      <label className={styles.label} htmlFor={id}>
        {label} <span aria-hidden="true">*</span>
      </label>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${styles.textarea} ${error ? styles.inputErr : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
      />
      {error && (
        <span id={`${id}-err`} className={styles.err} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
