import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, setLenis, prefersReduced } from './lib/motion';
import Nav from './sections/Nav';
import Hero from './sections/Hero';
import Story from './sections/Story';
import Collection from './sections/Collection';
import Flavor from './sections/Flavor';
import Journey from './sections/Journey';
import Lifestyle from './sections/Lifestyle';
import Moment from './sections/Moment';
import FinalCta from './sections/FinalCta';
import Footer from './sections/Footer';

export default function App() {
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    let lenis: Lenis | null = null;
    let tick: ((t: number) => void) | null = null;
    if (!prefersReduced()) {
      lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, autoRaf: false });
      lenis.on('scroll', ScrollTrigger.update);
      tick = (t: number) => lenis!.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      setLenis(lenis);
    }
    // fonts change text metrics → recalc pinned positions once loaded
    // pins must be measured in page order — sort defensively (HMR / async mounts) then measure once fonts land
    const settle = () => { ScrollTrigger.sort(); ScrollTrigger.refresh(); };
    settle();
    document.fonts?.ready.then(settle);
    return () => {
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <>
      <a className="skip-link" href="#collection">Skip to our coffee</a>
      <Nav />
      <main id="main">
        <Hero />
        <Story />
        <Collection />
        <Flavor />
        <Journey />
        <Lifestyle />
        <Moment />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
