import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';
import { sendContactForm, type SendResult } from '../../services/contact.service';

vi.mock('../../services/contact.service', () => ({ sendContactForm: vi.fn() }));
const send = vi.mocked(sendContactForm);

const VALID = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  subject: 'Senior role',
  message: 'We would like to talk about a role.',
};

async function fill(user: ReturnType<typeof userEvent.setup>, data = VALID) {
  await user.type(screen.getByLabelText('Name'), data.name);
  await user.type(screen.getByLabelText('Email'), data.email);
  await user.type(screen.getByLabelText('Subject'), data.subject);
  await user.type(screen.getByLabelText('Message'), data.message);
}

const submit = () => screen.getByRole('button', { name: /send message|sending/i });

describe('contact form', () => {
  beforeEach(() => {
    send.mockReset();
  });

  it('shows every problem at once, focuses the first, and sends nothing', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.click(submit());

    for (const label of ['Name', 'Email', 'Subject', 'Message']) {
      expect(screen.getByLabelText(label)).toHaveAttribute('aria-invalid', 'true');
    }
    expect(screen.getByLabelText('Name')).toHaveFocus();
    expect(screen.getByText(/enter a valid email address/i)).toBeInTheDocument();
    expect(send).not.toHaveBeenCalled();
  });

  it('clears a field’s error as soon as it is edited', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.click(submit());
    await user.type(screen.getByLabelText('Email'), 'a');
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'false');
    expect(screen.queryByText(/enter a valid email address/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'true');
  });

  it('sends the form, shows progress, then confirms', async () => {
    let resolve: (r: SendResult) => void = () => undefined;
    send.mockReturnValue(new Promise((r) => (resolve = r)));
    const user = userEvent.setup();
    render(<ContactForm />);
    await fill(user);
    await user.click(submit());

    expect(send).toHaveBeenCalledWith(VALID);
    expect(submit()).toBeDisabled();
    expect(submit()).toHaveTextContent('Sending…');

    resolve({ ok: true, channel: 'formspree' });
    expect(await screen.findByRole('status')).toHaveTextContent(/message received/i);

    await user.click(screen.getByRole('button', { name: 'Write another' }));
    expect(screen.getByLabelText('Name')).toHaveValue('');
  });

  it('tells the visitor to finish in their mail app when there is no form service', async () => {
    send.mockResolvedValue({ ok: true, channel: 'mailto' });
    const user = userEvent.setup();
    render(<ContactForm />);
    await fill(user);
    await user.click(submit());
    expect(await screen.findByRole('status')).toHaveTextContent(/mail app should be open/i);
  });

  it('keeps what was typed and explains a failure', async () => {
    send.mockResolvedValue({ ok: false, error: 'Formspree submission failed: HTTP 500' });
    const user = userEvent.setup();
    render(<ContactForm />);
    await fill(user);
    await user.click(submit());

    expect(await screen.findByRole('alert')).toHaveTextContent('HTTP 500');
    expect(screen.getByLabelText('Message')).toHaveValue(VALID.message);
    expect(submit()).toBeEnabled();
  });

  it('silently drops a submission that filled the hidden trap field', async () => {
    const user = userEvent.setup();
    const { container } = render(<ContactForm />);
    const trap = container.querySelector<HTMLInputElement>('#cf-hp');
    expect(trap).not.toBeNull();
    if (!trap) return;
    await user.type(trap, 'bot');
    await fill(user);
    await user.click(submit());
    expect(send).not.toHaveBeenCalled();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
