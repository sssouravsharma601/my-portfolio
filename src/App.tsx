import { useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { useSpotlight } from './hooks/useSpotlight';
import './styles/globals.css';

/**
 * Best-effort framebusting. GitHub Pages can't send X-Frame-Options or a
 * frame-ancestors CSP header, and neither works from a <meta> tag.
 */
function useFrameGuard() {
  useEffect(() => {
    if (window.self !== window.top) {
      window.top?.location.replace(window.self.location.href);
    }
  }, []);
}

export default function App() {
  useFrameGuard();
  useSpotlight();
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <div className="progress" aria-hidden="true" />
        <Header />
        <main id="main">
          <Hero />
          <About />
          <Experience />
          <Skills />
          <Contact />
        </main>
        <Footer />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
