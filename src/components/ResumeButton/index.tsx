import { useState, type ReactNode } from 'react';
import { downloadResume } from '../../resume/download';
import { Download } from '../Icons';

interface Props {
  className?: string;
  children: ReactNode;
}

type State = 'idle' | 'working' | 'failed';

/**
 * Builds the résumé PDF in the browser, as of today, and downloads it.
 * The generator is fetched on the first press, so it costs nothing until then.
 */
export default function ResumeButton({ className, children }: Props) {
  const [state, setState] = useState<State>('idle');

  const onClick = () => {
    setState('working');
    downloadResume().then(
      () => setState('idle'),
      () => setState('failed'),
    );
  };

  return (
    <button type="button" className={className} onClick={onClick} disabled={state === 'working'}>
      <span aria-live="polite">
        {state === 'working' ? 'Preparing…' : state === 'failed' ? 'Try again' : children}
      </span>
      <Download />
    </button>
  );
}
