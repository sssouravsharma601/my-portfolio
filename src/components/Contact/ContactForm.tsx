import { useState, type FormEvent } from 'react';
import type { FormData, FormErrors } from '../../types';
import styles from './Contact.module.css';

function sanitize(str: string): string {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str.trim().slice(0, 5000)));
  return div.innerHTML;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]{1,64}@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 254;
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim() || data.name.trim().length < 2) {
    errors.name = 'Please enter your full name (at least 2 characters).';
  }
  if (!validateEmail(data.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!data.subject.trim() || data.subject.trim().length < 3) {
    errors.subject = 'Please enter a subject (at least 3 characters).';
  }
  if (!data.message.trim() || data.message.trim().length < 10) {
    errors.message = 'Please write a message (at least 10 characters).';
  }
  return errors;
}

export default function ContactForm() {
  const [form, setForm]       = useState<FormData>({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors]   = useState<FormErrors>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [honeypot, setHoneypot] = useState('');

  const update = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // bot trap

    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSending(true);
    // Simulate async send — swap for a real API call (e.g. Formspree / EmailJS)
    setTimeout(() => { setSending(false); setSent(true); }, 1100);
  };

  if (sent) {
    const mailtoHref = `mailto:sssouravsharma601@gmail.com?subject=${encodeURIComponent(sanitize(form.subject))}&body=${encodeURIComponent(`From: ${sanitize(form.name)} <${sanitize(form.email)}>\n\n${sanitize(form.message)}`)}`;
    return (
      <div className={styles.success} role="status" aria-live="polite">
        <div className={styles.successIcon}>🎉</div>
        <h3>Message Sent!</h3>
        <p>Thanks for reaching out. I'll reply within 24–48 hours to the email you provided.</p>
        <a href={mailtoHref} className={styles.mailtoLink}>Or open your email client →</a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Contact form" className={styles.form}>
      {/* Honeypot — off-screen, hidden from real users */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <label htmlFor="hp">Leave this blank</label>
        <input
          id="hp" type="text" tabIndex={-1} autoComplete="off"
          value={honeypot} onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className={styles.row}>
        <Field id="name"    label="Full Name"      error={errors.name}    type="text"
               value={form.name}    onChange={update('name')}    placeholder="Your name"
               autoComplete="name" />
        <Field id="email"   label="Email Address"  error={errors.email}   type="email"
               value={form.email}   onChange={update('email')}   placeholder="you@example.com"
               autoComplete="email" />
      </div>
      <Field id="subject"  label="Subject"        error={errors.subject}  type="text"
             value={form.subject}  onChange={update('subject')}  placeholder="Job opportunity / Collaboration / Other" />
      <TextareaField id="message" label="Message" error={errors.message}
                     value={form.message} onChange={update('message')}
                     placeholder="Tell me about the opportunity…" />

      <button type="submit" className={`${styles.submit} ${sending ? styles.busy : ''}`} disabled={sending}>
        {sending ? 'Sending…' : 'Send Message ✈️'}
      </button>
    </form>
  );
}

/* ── Local sub-components ── */
interface FieldProps {
  id: string;
  label: string;
  error?: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
        id={id} type={type} value={value} onChange={onChange}
        placeholder={placeholder} autoComplete={autoComplete}
        className={`${styles.input} ${error ? styles.inputErr : ''}`}
        aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined}
      />
      {error && <span id={`${id}-err`} className={styles.err} role="alert">{error}</span>}
    </div>
  );
}

interface TextareaProps {
  id: string;
  label: string;
  error?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
}

function TextareaField({ id, label, error, value, onChange, placeholder }: TextareaProps) {
  return (
    <div className={styles.group}>
      <label className={styles.label} htmlFor={id}>
        {label} <span aria-hidden="true">*</span>
      </label>
      <textarea
        id={id} value={value} onChange={onChange} placeholder={placeholder}
        className={`${styles.textarea} ${error ? styles.inputErr : ''}`}
        aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined}
      />
      {error && <span id={`${id}-err`} className={styles.err} role="alert">{error}</span>}
    </div>
  );
}
