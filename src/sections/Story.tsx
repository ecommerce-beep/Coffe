import { useRef } from 'react';
import { gsap, useGSAP, prefersReduced, seeded } from '../lib/motion';
import { Bean, Smile } from '../components/art';
import { Chars } from '../components/ui';
import { C } from '../lib/data';

// composed resting positions (percent of section) — framing the headline
const BEANS = [
  { x: 6, y: 10, s: 5.5, d: 1.4, r: -20 },
  { x: 22, y: 4, s: 3, d: 0.6, r: 40 },
  { x: 47, y: 8, s: 2.4, d: 0.4, r: 110 },
  { x: 68, y: 3, s: 4.4, d: 1.1, r: -60 },
  { x: 90, y: 14, s: 6.5, d: 1.6, r: 20 },
  { x: 82, y: 38, s: 2.6, d: 0.5, r: 160 },
  { x: 94, y: 58, s: 4, d: 1, r: -110 },
  { x: 74, y: 84, s: 5.6, d: 1.5, r: 70 },
  { x: 52, y: 92, s: 2.8, d: 0.5, r: -10 },
  { x: 30, y: 86, s: 4.6, d: 1.2, r: 140 },
  { x: 8, y: 70, s: 3.4, d: 0.8, r: -150 },
  { x: 3, y: 42, s: 2.2, d: 0.4, r: 60 },
  { x: 40, y: 52, s: 1.8, d: 0.3, r: -40 },
  { x: 60, y: 60, s: 2, d: 0.35, r: 90 },
];

const RING_TEXT = 'COFFEE FOR THE CURIOUS ONES • YOUR DAILY DOSE OF HAPPY • ';

export default function Story() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      if (prefersReduced()) return;
      const beans = q('.story__bean');
      const rnd = seeded(42);
      const scatter = beans.map(() => ({ x: (rnd() - 0.5) * 1.4, y: (rnd() - 0.5) * 1.2, r: (rnd() - 0.5) * 720 }));

      /* Signature: COFFEE BEAN EXPLOSION — beans burst from where the cup left, then settle into composition */
      const sec = root.current!;
      const toCluster = (el: Element, axis: 'x' | 'y') => {
        const b = el as HTMLElement;
        const cx = sec.offsetWidth * 0.58;
        const cy = -window.innerHeight * 0.45;
        return axis === 'x' ? cx - (b.offsetLeft + b.offsetWidth / 2) : cy - (b.offsetTop + b.offsetHeight / 2);
      };
      const boom = gsap.timeline({
        scrollTrigger: { trigger: sec, start: 'top bottom', end: 'top 5%', scrub: 1, invalidateOnRefresh: true },
      });
      boom
        .fromTo(
          beans,
          { x: (_i, el) => toCluster(el, 'x'), y: (_i, el) => toCluster(el, 'y'), scale: 0.2, rotation: 0 },
          {
            x: (i) => scatter[i].x * window.innerWidth,
            y: (i) => scatter[i].y * window.innerHeight,
            scale: 1.35,
            rotation: (i) => scatter[i].r,
            ease: 'power3.out',
            duration: 0.45,
          },
        )
        .to(beans, { x: 0, y: 0, scale: 1, rotation: 0, ease: 'power2.inOut', duration: 0.55 });

      // depth parallax once settled
      beans.forEach((b) => {
        const d = Number(b.getAttribute('data-depth'));
        gsap.to(b.querySelector('.story__bean-par'), {
          y: () => -window.innerHeight * 0.35 * d,
          ease: 'none',
          scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
        });
      });
      gsap.to(q('.story__bean svg'), { rotation: '+=360', duration: (i) => 18 + i * 3, repeat: -1, ease: 'none' });

      /* Typography — three different motions */
      const words = gsap.timeline({ scrollTrigger: { trigger: q('.story__head')[0], start: 'top 75%' } });
      words
        .from(q('.story__l1'), { xPercent: -60, opacity: 0, duration: 1.4, ease: 'expo.out' })
        .from(q('.story__l2-inner'), { yPercent: 110, duration: 1.2, ease: 'expo.out' }, 0.25)
        .from(q('.story__coffee .char'), { yPercent: -120, rotation: (i) => (i % 2 ? 25 : -25), opacity: 0, stagger: 0.05, duration: 1, ease: 'back.out(2.2)' }, 0.1)
        .from(q('.story__eyebrow'), { opacity: 0, y: 20, duration: 0.8 }, 0)
        .from(q('.story__copy p'), { clipPath: 'inset(0 0 100% 0)', y: 40, stagger: 0.12, duration: 1.1, ease: 'expo.out' }, 0.5)
        .from(q('.story__ring'), { scale: 0, rotation: -180, duration: 1.4, ease: 'back.out(1.6)' }, 0.4)
        .add(() => {
          // kinetic 'COFFEE' — a playful idle wobble
          gsap.to(q('.story__coffee .char'), {
            y: -10, rotation: (i) => (i % 2 ? 6 : -6),
            duration: 0.7, ease: 'sine.inOut', yoyo: true, repeat: -1,
            stagger: { each: 0.09, yoyo: true, repeat: -1 },
          });
        });

      gsap.to(q('.story__ring-svg'), { rotation: 360, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: 0.5 } });
      gsap.to(q('.story__blob'), {
        borderRadius: '40% 60% 58% 42% / 42% 52% 48% 58%', rotation: 25, yPercent: -20, ease: 'none',
        scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="story" className="story" aria-labelledby="story-title">
      <div className="blob story__blob story__blob--peach" aria-hidden="true" />
      <div className="blob story__blob story__blob--butter" aria-hidden="true" />

      <div className="story__beans" aria-hidden="true">
        {BEANS.map((b, i) => (
          <div key={i} className={`story__bean ${b.d < 0.5 ? 'is-far' : ''}`} data-depth={b.d} style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.s}vw`, zIndex: b.d > 1 ? 3 : 1 }}>
            <div className="story__bean-par" style={{ transform: `rotate(${b.r}deg)`, filter: b.d < 0.5 ? 'blur(1.5px)' : undefined, opacity: b.d < 0.5 ? 0.7 : 1 }}>
              <Bean color={i % 5 === 0 ? C.cherry : C.espresso} crease={i % 5 === 0 ? '#6e2132' : '#2e211d'} />
            </div>
          </div>
        ))}
      </div>

      <div className="story__inner">
        <p className="eyebrow story__eyebrow">Not your ordinary coffee.</p>
        <h2 id="story-title" className="story__head">
          <span className="story__l1">
            <Chars text="Coffee" className="story__coffee" /> is serious.
          </span>
          <span className="mask story__l2"><span className="story__l2-inner">We don’t have to be.</span></span>
        </h2>

        <div className="story__copy">
          <p className="story__lead">
            At KUPPA, we believe great coffee should spark great moods. Bold flavors, curious minds, and a little bit of everyday magic.
          </p>
          <p>
            We source beans that taste like something, roast them with character, and pack them in bags that make your shelf smile.
            <Smile className="story__smile" />
          </p>
        </div>

        <div className="story__ring" aria-hidden="true">
          <svg viewBox="0 0 200 200" className="story__ring-svg">
            <defs>
              <path id="ringPath" d="M100 100 m-78 0 a78 78 0 1 1 156 0 a78 78 0 1 1 -156 0" />
            </defs>
            <circle cx="100" cy="100" r="98" fill={C.butter} />
            <text fontFamily="Outfit" fontWeight="800" fontSize="13.4" letterSpacing="2.2" fill={C.cherry}>
              <textPath href="#ringPath">{RING_TEXT}</textPath>
            </text>
          </svg>
          <Bean className="story__ring-bean" color={C.cherry} crease="#6e2132" />
        </div>
      </div>

      <svg className="story__edge" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 60 C240 120 420 0 720 50 C1020 100 1200 10 1440 60 L1440 120 L0 120 Z" fill={C.peach} />
      </svg>
    </section>
  );
}
