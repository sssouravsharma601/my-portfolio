import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResumeButton from './index';
import { downloadResume } from '../../resume/download';

vi.mock('../../resume/download', () => ({ downloadResume: vi.fn() }));
const download = vi.mocked(downloadResume);

describe('ResumeButton', () => {
  beforeEach(() => {
    download.mockReset();
  });

  it('builds and downloads the résumé when pressed', async () => {
    download.mockResolvedValue();
    render(<ResumeButton>Résumé</ResumeButton>);
    await userEvent.click(screen.getByRole('button', { name: 'Résumé' }));
    expect(download).toHaveBeenCalledTimes(1);
    expect(await screen.findByRole('button', { name: 'Résumé' })).toBeEnabled();
  });

  it('is busy while the file is being prepared', async () => {
    let finish: () => void = () => undefined;
    download.mockReturnValue(new Promise<void>((resolve) => (finish = resolve)));
    render(<ResumeButton>Résumé</ResumeButton>);
    await userEvent.click(screen.getByRole('button', { name: 'Résumé' }));
    expect(screen.getByRole('button', { name: 'Preparing…' })).toBeDisabled();
    finish();
    expect(await screen.findByRole('button', { name: 'Résumé' })).toBeEnabled();
  });

  it('offers another try if it fails', async () => {
    download.mockRejectedValue(new Error('offline'));
    render(<ResumeButton>Résumé</ResumeButton>);
    await userEvent.click(screen.getByRole('button', { name: 'Résumé' }));
    expect(await screen.findByRole('button', { name: 'Try again' })).toBeEnabled();
  });
});
