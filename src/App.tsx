import { useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { SmoothScrollProvider } from './animation/SmoothScrollProvider';
import ErrorBoundary from './components/ErrorBoundary';

import Sidebar from './components/Sidebar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Education from './components/Education';
import Contact from './components/Contact';
import Footer from './components/Footer';

import CustomCursor from './components/ui/CustomCursor';
import BackToTop from './components/ui/BackToTop';
import ScrollProgress from './components/ui/ScrollProgress';

import './styles/globals.css';
import './styles/animations.css';

/** Defense-in-depth: redirect if this page is embedded in an iframe. */
function FrameGuard() {
  useEffect(() => {
    if (window.self !== window.top) {
      window.top?.location.replace(window.self.location.href);
    }
  }, []);
  return null;
}

export default function App() {
  return (
    <ErrorBoundary>
      {/* reducedMotion="user" makes every Framer Motion animation in the tree
          respect the OS-level prefers-reduced-motion setting automatically —
          GSAP work is gated separately per-component via matchMedia. */}
      <MotionConfig reducedMotion="user">
        <ThemeProvider>
          <SmoothScrollProvider>
            <FrameGuard />
            <ScrollProgress />
            <CustomCursor />
            <BackToTop />
            <Sidebar />
            <div className="content-shell">
              <main id="main-content">
                <Hero />
                <About />
                <Experience />
                <Skills />
                <Education />
                <Contact />
              </main>
              <Footer />
            </div>
          </SmoothScrollProvider>
        </ThemeProvider>
      </MotionConfig>
    </ErrorBoundary>
  );
}
