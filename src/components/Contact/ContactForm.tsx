import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { FormData, FormErrors } from '../../types';
import { validateContactForm } from '../../utils/validation';
import { sendContactForm } from '../../services/contact.service';
import styles from './Contact.module.css';

const EMPTY: FormData = { name: '', email: '', subject: '', message: '' };

type Status = 'idle' | 'sending' | 'sent-formspree' | 'sent-mailto';

export default function ContactForm() {
  const [form, setForm] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [sendError, setSendError] = useState<string | null>(null);

  const update =
    (field: keyof FormData) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (honeypot) return;

    const errs = validateContactForm(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const first = Object.keys(errs)[0];
      if (first) document.getElementById(`cf-${first}`)?.focus();
      return;
    }

    setStatus('sending');
    setSendError(null);
    void sendContactForm(form).then((res) => {
      if (res.ok) {
        setStatus(res.channel === 'formspree' ? 'sent-formspree' : 'sent-mailto');
        setForm(EMPTY);
      } else {
        setStatus('idle');
        setSendError(res.error);
      }
    });
  };

  if (status === 'sent-formspree' || status === 'sent-mailto') {
    return (
      <div className={styles.sent} role="status">
        <p className={styles.sentTitle}>
          {status === 'sent-formspree'
            ? 'Thanks, message received.'
            : 'Your mail app should be open.'}
        </p>
        <p className={styles.sentBody}>
          {status === 'sent-formspree'
            ? 'I’ll get back to you at the address you gave.'
            : 'Hit send there and it comes straight to my inbox.'}
        </p>
        <button type="button" className={styles.reset} onClick={() => setStatus('idle')}>
          Write another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className={styles.form} aria-label="Contact form">
      <div aria-hidden="true" className={styles.hp}>
        <label htmlFor="cf-hp">Leave this blank</label>
        <input
          id="cf-hp"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className={styles.row}>
        <Field id="name" label="Name" error={errors.name}>
          <input
            id="cf-name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={update('name')}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'cf-name-err' : undefined}
          />
        </Field>
        <Field id="email" label="Email" error={errors.email}>
          <input
            id="cf-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={form.email}
            onChange={update('email')}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'cf-email-err' : undefined}
          />
        </Field>
      </div>

      <Field id="subject" label="Subject" error={errors.subject}>
        <input
          id="cf-subject"
          type="text"
          value={form.subject}
          onChange={update('subject')}
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? 'cf-subject-err' : undefined}
        />
      </Field>

      <Field id="message" label="Message" error={errors.message}>
        <textarea
          id="cf-message"
          rows={5}
          value={form.message}
          onChange={update('message')}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'cf-message-err' : undefined}
        />
      </Field>

      {sendError && (
        <p className={styles.error} role="alert">
          Couldn’t send that. {sendError}
        </p>
      )}

      <button type="submit" className={styles.submit} disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.field}>
      <label htmlFor={`cf-${id}`}>{label}</label>
      {children}
      {error && (
        <span id={`cf-${id}-err`} className={styles.error}>
          {error}
        </span>
      )}
    </div>
  );
}
