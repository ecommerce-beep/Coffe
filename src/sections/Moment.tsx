import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP, prefersReduced, splashPath } from '../lib/motion';
import { TakeawayCup, Bean, Sparkle } from '../components/art';
import { MagButton, Chars } from '../components/ui';
import { C } from '../lib/data';

const MESSAGES = ['Good mood unlocked.', 'That’s the KUPPA effect.', 'Sip happens.', 'Brew something good.', 'Life is better with KUPPA.'];
const SPLASHES = [1, 2, 3, 4].map((s) => splashPath(300, 300, 210, 14, s * 13, 0.42));
const SHAPES = [
  { c: C.butter, k: 'circle', x: 14, y: 22, s: 7 },
  { c: C.peach, k: 'blob', x: 82, y: 18, s: 9 },
  { c: C.cherry, k: 'circle', x: 88, y: 70, s: 5 },
  { c: C.cream, k: 'blob', x: 8, y: 74, s: 8 },
  { c: C.butter, k: 'spark', x: 70, y: 86, s: 4 },
  { c: C.cream, k: 'spark', x: 28, y: 10, s: 3.5 },
  { c: C.espresso, k: 'bean', x: 22, y: 50, s: 3.2 },
  { c: C.espresso, k: 'bean', x: 76, y: 44, s: 2.8 },
];

export default function Moment() {
  const root = useRef<HTMLElement>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const count = useRef(0);
  const splashIdx = useRef(0);
  const magic = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      if (prefersReduced()) return;
      const q = gsap.utils.selector(root);
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 60%' } });
      tl.from(q('.moment__cup'), { rotation: -35, yPercent: 60, scale: 0.6, opacity: 0, duration: 1.4, ease: 'back.out(1.5)' }, 0)
        .from(q('.moment__splash'), { scale: 0, rotation: -90, duration: 1.4, ease: 'elastic.out(1, 0.5)', transformOrigin: '50% 50%' }, 0.2)
        .from(q('.moment__shape'), { x: 0, y: 0, left: '50%', top: '50%', scale: 0, duration: 1.3, stagger: 0.05, ease: 'expo.out' }, 0.35)
        .from(q('.moment__l1 .char'), { yPercent: 120, rotation: 20, stagger: 0.04, duration: 0.9, ease: 'back.out(2)' }, 0.3)
        .from(q('.moment__l2 .char'), { yPercent: -120, rotation: -20, stagger: 0.03, duration: 0.9, ease: 'back.out(2)' }, 0.5)
        .from(q('.moment__ctrl'), { y: 30, opacity: 0, duration: 0.8 }, 0.9);
      gsap.to(q('.moment__cupfloat'), { y: -16, rotation: 2, duration: 2.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      gsap.to(q('.moment__splash-path'), { rotation: 360, duration: 60, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
    },
    { scope: root },
  );

  // message pops in after React has rendered the new characters
  useEffect(() => {
    if (!msg || prefersReduced() || !root.current) return;
    const chars = root.current.querySelectorAll('.moment__msg .char');
    const t = gsap.fromTo(chars, { yPercent: 120, rotation: 15, opacity: 0 }, { yPercent: 0, rotation: 0, opacity: 1, stagger: 0.02, duration: 0.6, ease: 'back.out(2.4)' });
    return () => { t.kill(); };
  }, [msg]);

  /* Signature: INTERACTIVE COFFEE SPLASH — fast, repeatable, interruptible */
  const makeMagic = () => {
    const q = gsap.utils.selector(root);
    const next = MESSAGES[count.current++ % MESSAGES.length];
    setMsg(next);
    splashIdx.current = (splashIdx.current + 1) % SPLASHES.length;
    if (prefersReduced()) return;
    magic.current?.progress(1).kill();
    const tl = gsap.timeline();
    tl.to(q('.moment__cup'), { scaleY: 0.82, scaleX: 1.12, duration: 0.12, ease: 'power2.out', transformOrigin: '50% 100%' })
      .to(q('.moment__cup'), { scaleY: 1.08, scaleX: 0.94, y: -90, rotation: gsap.utils.random(-14, 14), duration: 0.32, ease: 'power3.out' })
      .to(q('.moment__cup'), { scaleY: 1, scaleX: 1, y: 0, rotation: 0, duration: 0.9, ease: 'elastic.out(1, 0.35)' })
      .to(q('.moment__splash-path'), { attr: { d: SPLASHES[splashIdx.current] }, duration: 0.8, ease: 'elastic.out(1, 0.4)' }, 0.1)
      .fromTo(q('.moment__splash'), { scale: 1.25 }, { scale: 1, duration: 1, ease: 'elastic.out(1, 0.35)' }, 0.12)
      .to(q('.moment__shape'), {
        x: () => gsap.utils.random(-140, 140),
        y: () => gsap.utils.random(-110, 110),
        rotation: () => gsap.utils.random(-180, 180),
        scale: () => gsap.utils.random(0.7, 1.4),
        duration: 1, ease: 'expo.out', stagger: 0.02,
      }, 0.1)
      .fromTo(q('.moment__drop'), { x: 0, y: 0, scale: 0, opacity: 1 }, {
        x: (i) => Math.cos((i / 8) * Math.PI * 2) * gsap.utils.random(160, 260),
        y: (i) => Math.sin((i / 8) * Math.PI * 2) * gsap.utils.random(120, 220) - 60,
        scale: () => gsap.utils.random(0.6, 1.3), opacity: 0, duration: 1, ease: 'expo.out',
      }, 0.12);
    magic.current = tl;
  };

  return (
    <section ref={root} id="moment" className="moment" aria-labelledby="moment-title">
      {SHAPES.map((s, i) => (
        <div key={i} className={`moment__shape moment__shape--${s.k}`} style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${s.s}vw`, color: s.c }} aria-hidden="true">
          {s.k === 'circle' && <span className="moment__dot" style={{ background: s.c }} />}
          {s.k === 'blob' && <span className="blob moment__dot" style={{ background: s.c, position: 'absolute', inset: 0 }} />}
          {s.k === 'spark' && <Sparkle color={s.c} />}
          {s.k === 'bean' && <Bean />}
        </div>
      ))}

      <h2 id="moment-title" className="moment__title">
        <Chars text="One sip." className="moment__l1" />
        <Chars text="Instant good mood." className="moment__l2" />
      </h2>

      <div className="moment__scene">
        <svg className="moment__splash" viewBox="0 0 600 600" aria-hidden="true">
          <path className="moment__splash-path" d={SPLASHES[0]} fill={C.cherry} />
          <circle cx="300" cy="300" r="120" fill={C.butter} opacity="0.95" />
        </svg>
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="moment__drop" style={{ background: i % 2 ? C.cherry : C.espresso }} aria-hidden="true" />
        ))}
        <div className="moment__cupfloat">
          <TakeawayCup className="moment__cup" sleeve={C.butter} lid={C.cherry} />
        </div>
      </div>

      <div className="moment__ctrl">
        <MagButton variant="default" size="lg" onClick={makeMagic}>Make some magic</MagButton>
        <p className="moment__msg display" aria-live="polite">{msg ? <Chars key={count.current} text={msg} /> : <span className="moment__hint">Go on. Press it.</span>}</p>
      </div>
    </section>
  );
}
