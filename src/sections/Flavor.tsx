import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP, prefersReduced } from '../lib/motion';
import { FLAVORS, PRODUCTS, C, type FlavorId, type ProductId } from '../lib/data';
import { FlavorArt, Bean, Bag } from '../components/art';
import { Chars } from '../components/ui';

const TAU = Math.PI * 2;
const FRONT = Math.PI / 2; // bottom of the ellipse = closest to the viewer

export default function Flavor() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [sel, setSel] = useState<FlavorId | null>(null);
  const orbit = useRef({ base: 0.3, spread: 0.15, target: 0.15, boost: [0, 0, 0, 0, 0], locked: false });

  /* Signature: FLAVOR ORBIT — a tiny physics-free orbit system driven by gsap.ticker */
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const reduce = prefersReduced();
      const items = q('.orbit__item') as HTMLElement[];
      const st = stage.current!;
      const sx = items.map((el) => gsap.quickSetter(el, 'x', 'px'));
      const sy = items.map((el) => gsap.quickSetter(el, 'y', 'px'));
      const ss = items.map((el) => gsap.quickSetter(el, 'scale'));
      const o = orbit.current;
      if (reduce) o.target = o.spread = 1;

      const tick = () => {
        if (!reduce && !o.locked) o.base += 0.0022 * gsap.ticker.deltaRatio();
        o.spread += (o.target - o.spread) * 0.08;
        const W = st.offsetWidth;
        const H = st.offsetHeight;
        const R = Math.min(W * 0.42, H * 0.95) * (0.18 + 0.82 * o.spread);
        items.forEach((el, i) => {
          const a = o.base + (i * TAU) / items.length;
          const depth = (Math.sin(a) + 1) / 2;
          sx[i](Math.cos(a) * R);
          sy[i](Math.sin(a) * R * 0.42);
          ss[i]((0.6 + 0.45 * depth) * (1 + o.boost[i] * 0.5));
          el.style.zIndex = String(Math.round(depth * 50) + Math.round(o.boost[i] * 60));
          el.style.setProperty('--depth', depth.toFixed(3));
        });
        st.style.setProperty('--spread', o.spread.toFixed(3));
      };
      gsap.ticker.add(tick);

      if (!reduce) {
        // objects separate as you arrive, then converge as you leave toward the next scene
        gsap.timeline({
          scrollTrigger: {
            trigger: root.current, start: 'top 70%', end: 'bottom top', scrub: true,
            onUpdate: (self) => {
              const p = self.progress;
              o.target = p < 0.35 ? 0.15 + (p / 0.35) * 0.85 : p > 0.82 ? Math.max(0, 1 - (p - 0.82) / 0.18) : 1;
            },
          },
        });
        gsap.to(q('.flavor__core'), {
          rotation: 200, ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
        });
        // kinetic heading: letters ride a wave tied to scroll
        gsap.fromTo(q('.flavor__title .char'),
          { yPercent: (i) => 60 + (i % 4) * 25, rotation: (i) => (i % 2 ? 12 : -12), opacity: 0 },
          {
            yPercent: 0, rotation: 0, opacity: 1, stagger: 0.03, ease: 'back.out(2)',
            scrollTrigger: { trigger: root.current, start: 'top 75%', end: 'top 15%', scrub: 1 },
          });
        gsap.from(q('.flavor__chips li'), {
          y: 30, opacity: 0, stagger: 0.06, duration: 0.8, ease: 'back.out(2)',
          scrollTrigger: { trigger: q('.flavor__chips')[0], start: 'top 90%' },
        });
      }
      return () => gsap.ticker.remove(tick);
    },
    { scope: root },
  );

  /* selection → bring object forward, pause orbit, tint the scene */
  useEffect(() => {
    const o = orbit.current;
    const idx = FLAVORS.findIndex((f) => f.id === sel);
    const dur = prefersReduced() ? 0 : 1.1;
    o.locked = idx >= 0;
    if (idx >= 0) {
      const target = FRONT - (idx * TAU) / FLAVORS.length;
      let diff = (target - o.base) % TAU;
      if (diff > Math.PI) diff -= TAU;
      if (diff < -Math.PI) diff += TAU;
      gsap.to(o, { base: o.base + diff, duration: dur, ease: 'power3.inOut', overwrite: true });
    }
    FLAVORS.forEach((_, i) => gsap.to(o.boost, { [i]: i === idx ? 1 : 0, duration: dur * 0.9, ease: 'back.out(1.7)' }));
    const q = gsap.utils.selector(root);
    gsap.to(q('.flavor__halo'), { backgroundColor: idx >= 0 ? FLAVORS[idx].tint : C.peach, scale: idx >= 0 ? 1.08 : 1, duration: dur, ease: 'power2.out' });
    gsap.fromTo(q('.flavor__desc > *'), { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: dur * 0.7, ease: 'expo.out' });
  }, [sel]);

  // DISCOVER buttons in the collection pick the product's lead flavor
  useEffect(() => {
    const on = (e: Event) => {
      const id = (e as CustomEvent<ProductId>).detail;
      const prod = PRODUCTS.find((p) => p.id === id);
      if (prod) setSel(prod.flavors[0]);
    };
    window.addEventListener('kuppa:discover', on);
    return () => window.removeEventListener('kuppa:discover', on);
  }, []);

  const flavor = FLAVORS.find((f) => f.id === sel);
  const toggle = (id: FlavorId) => setSel((s) => (s === id ? null : id));

  return (
    <section ref={root} id="flavor" className="flavor" aria-labelledby="flavor-title">
      <svg className="flavor__drip" viewBox="0 0 1440 140" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 0 H1440 V40 C1380 40 1370 110 1330 110 C1290 110 1300 40 1220 40 C1120 40 1100 70 1040 70 C990 70 980 40 900 40 C840 40 830 130 780 130 C730 130 740 40 660 40 C560 40 560 80 500 80 C450 80 440 40 360 40 C300 40 300 100 250 100 C200 100 210 40 140 40 C80 40 60 60 0 60 Z" fill={C.cherry} />
      </svg>
      <div className="flavor__sticky">
        <div className="flavor__text">
          <p className="eyebrow">Flavor experience</p>
          <h2 id="flavor-title" className="flavor__title">
            <Chars text="Taste the" />
            <br />
            <Chars text="good stuff." />
          </h2>
          <ul className="flavor__chips" aria-label="Pick a flavor">
            {FLAVORS.map((f) => (
              <li key={f.id}>
                <button className={`chip ${sel === f.id ? 'is-on' : ''}`} aria-pressed={sel === f.id} onClick={() => toggle(f.id)}>
                  {f.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="flavor__desc" aria-live="polite">
            {flavor ? (
              <>
                <h3 className="flavor__desc-title">{flavor.label}</h3>
                <p>{flavor.line}</p>
              </>
            ) : (
              <>
                <h3 className="flavor__desc-title">Pick a flavor.</h3>
                <p>Tap a note — or catch one in orbit — to see which KUPPA coffee it lives in.</p>
              </>
            )}
            <ul className="flavor__matches" aria-label="KUPPA coffees with this flavor">
              {PRODUCTS.map((p) => {
                const match = !!sel && p.flavors.includes(sel);
                return (
                  <li key={p.id} className={`flavor__match ${match ? 'is-match' : ''} ${sel && !match ? 'is-dim' : ''}`}>
                    <Bag product={p} compact className="flavor__match-bag" />
                    <span>{p.name.join(' ')}{match ? ' ✓' : ''}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="flavor__stage" ref={stage}>
          <div className="flavor__halo" aria-hidden="true" />
          <div className="flavor__ring" aria-hidden="true" />
          <div className="flavor__core" aria-hidden="true"><Bean /></div>
          {FLAVORS.map((f) => (
            <button
              key={f.id}
              className={`orbit__item ${sel === f.id ? 'is-sel' : ''}`}
              onClick={() => toggle(f.id)}
              aria-pressed={sel === f.id}
              aria-label={`Select ${f.label}`}
            >
              <FlavorArt id={f.id} className="orbit__art" />
              <span className="orbit__label">{f.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
