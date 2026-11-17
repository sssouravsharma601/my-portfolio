/**
 * Builds the résumé as of this moment and hands it to the browser as a file.
 * The generator is loaded only when someone asks for it.
 */
export async function downloadResume(): Promise<void> {
  const { buildResume, RESUME_FILE_NAME } = await import('./build');
  const blob = new Blob([buildResume(new Date())], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = RESUME_FILE_NAME;
  anchor.hidden = true;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  // Give the browser a moment to start the download before the URL goes away.
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
