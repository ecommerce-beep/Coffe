import { useRef } from 'react';
import { gsap, useGSAP, prefersReduced, isMobile, finePointer } from '../lib/motion';
import { GlassCup, Bean, Sparkle } from '../components/art';
import { MagButton } from '../components/ui';
import { C } from '../lib/data';

const FLOATS = [
  { k: 'bean', x: 18, y: 30, s: 4.2, r: -30 },
  { k: 'bean', x: 78, y: 24, s: 3.2, r: 40 },
  { k: 'bean', x: 84, y: 66, s: 5, r: 120 },
  { k: 'bean', x: 12, y: 72, s: 3, r: 70 },
  { k: 'spark', x: 70, y: 14, s: 2.6, r: 0 },
  { k: 'spark', x: 26, y: 58, s: 2, r: 0 },
  { k: 'drop', x: 64, y: 78, s: 1.6, r: 0 },
  { k: 'drop', x: 33, y: 20, s: 1.2, r: 0 },
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const reduce = prefersReduced();
      const liquid = q('.hero__cup .cup__liquid');
      const FULL = 345 * (1 - 0.86);

      // always-on liquid surface motion (cheap: transform only)
      if (!reduce) {
        gsap.to(q('.hero__cup .cup__wave--front'), { x: -110, duration: 2.2, repeat: -1, ease: 'none' });
        gsap.to(q('.hero__cup .cup__wave--back'), { x: 130, duration: 3.4, repeat: -1, ease: 'none' });
        gsap.to(q('.hero__cup .cup__bubble'), { y: -40, opacity: 0, duration: 2.6, repeat: -1, stagger: 0.7, ease: 'power1.in' });
        gsap.to(q('.hero__float-inner'), { y: '+=14', rotation: '+=12', duration: 2.8, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: 0.3 });
      }

      if (reduce) {
        gsap.set(liquid, { y: FULL });
        return;
      }

      /* ---------- Stage 01 · cinematic entrance ---------- */
      const intro = gsap.timeline({ delay: 0.1 });
      intro
        .from(q('.hero__bgshape'), { opacity: 0, scale: 0.6, duration: 1.4, ease: 'expo.out' }, 0)
        .from(q('.hero__line-inner'), { yPercent: 115, duration: 1.3, stagger: 0.14, ease: 'expo.out' }, 0.15)
        .from(q('.hero__cupintro'), { y: () => window.innerHeight * 0.85, rotation: -16, scale: 0.7, duration: 1.7, ease: 'expo.out' }, 0.35)
        .from(q('.hero__cup .cup__liquid'), { y: 345, duration: 1.6, ease: 'power2.out' }, 0.7)
        .from(q('.hero__blob'), { scale: 0, rotation: -60, duration: 1.6, stagger: 0.12, ease: 'elastic.out(1, 0.55)' }, 0.7)
        .from(q('.hero__float'), { scale: 0, opacity: 0, duration: 0.9, stagger: 0.05, ease: 'back.out(2)' }, 0.95)
        .from(document.querySelector('.nav__bar'), { y: -30, opacity: 0, duration: 0.9, ease: 'expo.out' }, 1.25)
        .from(q('.hero__meta > *'), { y: 30, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'expo.out' }, 1.3);

      /* ---------- Stage 02 · cursor-reactive cup ---------- */
      if (finePointer()) {
        const tilt = q('.hero__cuptilt')[0];
        gsap.set(tilt, { transformPerspective: 1100 });
        const ry = gsap.quickTo(tilt, 'rotationY', { duration: 1.1, ease: 'power3.out' });
        const rx = gsap.quickTo(tilt, 'rotationX', { duration: 1.1, ease: 'power3.out' });
        const shine = gsap.quickTo(q('.hero__cup .cup__shine'), 'x', { duration: 1.1, ease: 'power3.out' });
        const blobs = gsap.quickTo(q('.hero__blobs'), 'x', { duration: 1.6, ease: 'power3.out' });
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          ry(nx * 18);
          rx(-ny * 12);
          shine(-nx * 60);
          blobs(nx * -30);
        };
        window.addEventListener('pointermove', onMove);
        return () => window.removeEventListener('pointermove', onMove);
      }
    },
    { scope: root },
  );

  // Stages 03 + 04 · scroll-scrubbed fill and hand-off (separate hook so the pointer cleanup above stays simple)
  useGSAP(
    () => {
      if (prefersReduced()) return;
      const q = gsap.utils.selector(root);
      const mobile = isMobile();
      const liquid = q('.hero__cup .cup__liquid');
      const FULL = 345 * (1 - 0.86);

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: mobile ? '+=150%' : '+=210%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      tl.to(q('.hero__meta'), { opacity: 0, y: 40, duration: 0.3 }, 0)
        .to(q('.hero__cupwrap'), { scale: mobile ? 1.15 : 1.3, yPercent: -3, rotation: -5, duration: 1 }, 0)
        .fromTo(liquid, { y: 345 * 0.9 }, { y: FULL, duration: 1.15, ease: 'power1.inOut', immediateRender: false }, 0)
        .to(q('.hero__line--1'), { yPercent: -45, xPercent: -5, duration: 1 }, 0)
        .to(q('.hero__line--2'), { yPercent: 45, xPercent: 5, duration: 1 }, 0)
        .to(q('.hero__float'), {
          x: (i) => (i % 2 ? 1 : -1) * (80 + i * 18),
          y: (i) => -100 - i * 26,
          rotation: (i) => (i % 2 ? 90 : -90),
          duration: 1.5,
        }, 0)
        .to(q('.hero__blob'), { scale: 1.25, rotation: 30, duration: 1.5 }, 0)
        .to(q('.hero__cupwrap'), { rotation: 3, duration: 0.4 }, 1)
        /* Stage 04 — cup takes over and opens the next scene */
        .to(q('.hero__title'), { opacity: 0, scale: 0.9, duration: 0.6 }, 1.35)
        .to(q('.hero__cupwrap'), { scale: mobile ? 2.4 : 3.1, xPercent: mobile ? 10 : 22, yPercent: 8, rotation: 16, duration: 1.1, ease: 'power2.in' }, 1.4)
        .fromTo(q('.hero__reveal'), { clipPath: 'circle(0% at 50% 58%)' }, { clipPath: 'circle(80% at 50% 58%)', duration: 1, ease: 'power2.in' }, 1.55)
        .to(q('.hero__cupwrap'), { yPercent: -160, rotation: 34, duration: 0.7, ease: 'power2.in' }, 2.25)
        .to(q('.hero__reveal-word'), { opacity: 1, scale: 1, duration: 0.4 }, 2.5);
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" className="hero" aria-label="KUPPA — Good coffee, good mood">
      <div className="hero__bgshape" aria-hidden="true" />
      <div className="hero__blobs" aria-hidden="true">
        <div className="blob hero__blob hero__blob--peach" />
        <div className="blob hero__blob hero__blob--butter" />
        <div className="blob hero__blob hero__blob--cherry" />
      </div>

      <h1 className="hero__title">
        <span className="mask hero__line hero__line--1"><span className="hero__line-inner">Good coffee.</span></span>
        <span className="mask hero__line hero__line--2"><span className="hero__line-inner">Good mood.</span></span>
      </h1>

      <div className="hero__floats" aria-hidden="true">
        {FLOATS.map((f, i) => (
          <div key={i} className="hero__float" style={{ left: `${f.x}%`, top: `${f.y}%`, width: `${f.s}vw`, transform: `rotate(${f.r}deg)` }}>
            <div className="hero__float-inner">
              {f.k === 'bean' && <Bean />}
              {f.k === 'spark' && <Sparkle color={i % 2 ? C.peach : C.butter} />}
              {f.k === 'drop' && (
                <svg viewBox="0 0 40 56"><path d="M20 0 C28 18 40 28 40 38 A20 18 0 0 1 0 38 C0 28 12 18 20 0Z" fill={C.espresso} /></svg>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="hero__reveal" aria-hidden="true">
        <span className="hero__reveal-word">sip different.</span>
      </div>

      <div className="hero__cupzone">
        <div className="hero__cupwrap">
          <div className="hero__cupintro">
            <div className="hero__cuptilt">
              <GlassCup className="hero__cup" fill={0.1} />
            </div>
          </div>
        </div>
      </div>

      <div className="hero__meta">
        <p className="hero__kicker">
          <span className="eyebrow">Specialty coffee</span>
          Coffee for the curious ones. Roasted to spark good moods.
        </p>
        <div className="hero__scroll" aria-hidden="true">
          <span className="hero__scroll-dot" />
          <span className="eyebrow">Scroll to fill</span>
        </div>
        <MagButton href="#story" size="lg" className="hero__cta">Explore KUPPA</MagButton>
      </div>
    </section>
  );
}
