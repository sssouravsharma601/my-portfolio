import { useState, useEffect } from 'react';

export function useTyping(phrases: string[], typingSpeed = 75, deletingSpeed = 45): string {
  const [displayed, setDisplayed] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const phrase = phrases[phraseIdx];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          const next = charIdx + 1;
          setDisplayed(phrase.slice(0, next));
          setCharIdx(next);

          if (next === phrase.length) {
            // Pause then start deleting
            setTimeout(() => setIsDeleting(true), 2400);
          }
        } else {
          const next = charIdx - 1;
          setDisplayed(phrase.slice(0, next));
          setCharIdx(next);

          if (next === 0) {
            setIsDeleting(false);
            setPhraseIdx((prev) => (prev + 1) % phrases.length);
          }
        }
      },
      isDeleting ? deletingSpeed : typingSpeed,
    );

    return () => clearTimeout(timeout);
  }, [charIdx, isDeleting, phraseIdx, phrases, typingSpeed, deletingSpeed]);

  return displayed;
}
