import { useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import CaseStudies from './components/CaseStudies';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import LatestPosts from './components/LatestPosts';
import { useSpotlight } from './hooks/useSpotlight';
import { blogSite } from './blog/site';
import { bustFrames } from './utils/frameGuard';
import './styles/globals.css';

/** See utils/frameGuard. */
function useFrameGuard() {
  useEffect(bustFrames, []);
}

export default function App() {
  useFrameGuard();
  useSpotlight();
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Header />
        <main id="main">
          <Hero />
          <About />
          <CaseStudies />
          <Experience />
          <Skills />
          <LatestPosts posts={blogSite.latest} />
          <Contact />
        </main>
        <Footer />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
