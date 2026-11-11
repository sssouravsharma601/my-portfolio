import { useEffect, useState } from 'react';

interface Props {
  timeZone: string;
}

function format(timeZone: string, d = new Date()): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d);
}

/**
 * Live wall-clock time in another zone; updates on the minute boundary.
 * Starts as a placeholder so the prerendered HTML doesn't bake in build time.
 */
export default function LocalTime({ timeZone }: Props) {
  const [now, setNow] = useState('--:--');

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    const tick = () => setNow(format(timeZone));
    tick();
    const timeout = setTimeout(
      () => {
        tick();
        interval = setInterval(tick, 60_000);
      },
      60_000 - (Date.now() % 60_000),
    );
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [timeZone]);

  return <time>{now}</time>;
}
