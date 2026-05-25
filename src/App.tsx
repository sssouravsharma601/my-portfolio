import { useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Education from './components/Education';
import Contact from './components/Contact';
import Footer from './components/Footer';

import CustomCursor from './components/ui/CustomCursor';
import BackToTop from './components/ui/BackToTop';

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
      <ThemeProvider>
        <FrameGuard />
        <CustomCursor />
        <BackToTop />
        <Navbar />
        <main>
          <Hero />
          <About />
          <Experience />
          <Skills />
          <Education />
          <Contact />
        </main>
        <Footer />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
