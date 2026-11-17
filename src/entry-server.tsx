import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { CAREER_START } from './data/profile';
import { yearsSince } from './utils/date';

/** Whole years of experience on the build date, for the description texts in <head>. */
export const years = (): number => yearsSince(CAREER_START, new Date());

/** Build-time only: scripts/prerender.mjs writes this into dist/index.html. */
export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
