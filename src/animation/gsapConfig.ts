import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Font swap (Space Grotesk / JetBrains Mono) shifts layout after first paint —
// re-measure pinned/scrubbed triggers once webfonts are actually applied.
if (typeof document !== 'undefined') {
  document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => undefined);
}

export { gsap, ScrollTrigger };
