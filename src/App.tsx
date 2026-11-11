import { useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import Intro from './components/Intro';
import About from './components/About';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
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
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Header />
        <main id="main">
          <Intro />
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
