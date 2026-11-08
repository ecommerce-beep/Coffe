import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP, prefersReduced, isMobile, useTilt, scrollToTarget } from '../lib/motion';
import { PRODUCTS, type ProductId } from '../lib/data';
import { Bag, Arrow, Sparkle } from '../components/art';
import { MagButton } from '../components/ui';

const BLOB_SHAPES = [
  ['58% 42% 63% 37% / 45% 55% 45% 55%', '35% 65% 41% 59% / 62% 38% 62% 38%'],
  ['42% 58% 35% 65% / 60% 40% 60% 40%', '66% 34% 55% 45% / 38% 62% 38% 62%'],
  ['70% 30% 48% 52% / 52% 63% 37% 48%', '45% 55% 70% 30% / 55% 30% 70% 45%'],
];

export default function Collection() {
  const root = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const tiltRef = useTilt<HTMLDivElement>(9, stageRef);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const prevRef = useRef(0);
  const stRef = useRef<ScrollTrigger | null>(null);
  const firstRun = useRef(true);

  /* Scroll-driven product switching (pinned) */
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const reduce = prefersReduced();
      gsap.set(q('.coll__bag'), { opacity: 0, rotationY: 70, xPercent: 60 });
      gsap.set(q('.coll__bag')[0], { opacity: 1, rotationY: 0, xPercent: 0 });
      if (reduce) return;
      const swing = gsap.quickTo(q('.coll__stage'), 'rotation', { duration: 0.8, ease: 'power3.out' });
      stRef.current = ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: () => `+=${window.innerHeight * (isMobile() ? 2.2 : 2.6)}`,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress * 3;
          const idx = Math.min(2, Math.floor(p));
          if (idx !== activeRef.current) setActive(idx);
          swing(((p - idx) - 0.5) * 10); // the star product rotates slightly while it holds the stage
        },
      });

      // entrance: section title + float loop
      gsap.from(q('.coll__title .mask > span'), {
        yPercent: 110, stagger: 0.1, duration: 1.2, ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 70%' },
      });
      gsap.to(q('.coll__float'), { y: -18, duration: 2.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    },
    { scope: root },
  );

  /* Product switch choreography */
  useEffect(() => {
    activeRef.current = active;
    const prev = prevRef.current;
    prevRef.current = active;
    const el = root.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
    const p = PRODUCTS[active];
    const instant = firstRun.current || prefersReduced();
    firstRun.current = false;
    const d = instant ? 0 : 1;
    const dir = active >= prev ? 1 : -1;
    const bags = q('.coll__bag');

    const tl = gsap.timeline({ defaults: { duration: 1 * d, ease: 'expo.out' } });
    if (prev !== active) {
      tl.to(bags[prev], { xPercent: -70 * dir, rotationY: -75 * dir, rotation: -8 * dir, opacity: 0, scale: 0.85, duration: 0.8 * d, ease: 'power3.in' }, 0);
      tl.fromTo(bags[active], { xPercent: 70 * dir, rotationY: 75 * dir, rotation: 8 * dir, opacity: 0, scale: 0.85 }, { xPercent: 0, rotationY: 0, rotation: 0, opacity: 1, scale: 1, duration: 1.3 * d }, 0.35 * d);
    }
    tl.to(el.querySelector('.coll__pin'), { backgroundColor: p.theme.bg, color: p.theme.text, duration: 0.9 * d, ease: 'power2.inOut' }, 0)
      .to(q('.coll__blob--a'), { backgroundColor: p.theme.blobA, borderRadius: BLOB_SHAPES[active][0], rotation: active * 60, scale: 1 + active * 0.08, duration: 1.4 * d, ease: 'elastic.out(1, 0.6)' }, 0)
      .to(q('.coll__blob--b'), { backgroundColor: p.theme.blobB, borderRadius: BLOB_SHAPES[active][1], rotation: -active * 45, duration: 1.4 * d, ease: 'elastic.out(1, 0.6)' }, 0.05)
      .fromTo(q('.coll__info [data-anim]'), { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06 * d, duration: 0.9 * d }, 0.3 * d)
      .fromTo(q('.coll__note'), { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, stagger: 0.07 * d, duration: 0.8 * d, ease: 'back.out(2.5)' }, 0.5 * d)
      .fromTo(q('.coll__ghost'), { yPercent: 12, opacity: 0 }, { yPercent: 0, opacity: 0.1, duration: 1.2 * d }, 0.2 * d);
    return () => { tl.progress(1).kill(); };
  }, [active]);

  const go = (i: number) => {
    const idx = (i + 3) % 3;
    const st = stRef.current;
    if (st) {
      // jump the scroll to the matching chapter so scroll & UI never disagree
      scrollToTarget(st.start + ((idx + 0.5) / 3) * (st.end - st.start));
    } else setActive(idx);
  };

  const discover = (id: ProductId) => {
    window.dispatchEvent(new CustomEvent('kuppa:discover', { detail: id }));
    scrollToTarget('#flavor');
  };

  const p = PRODUCTS[active];

  return (
    <section ref={root} id="collection" className="coll" aria-labelledby="coll-title">
      <div className="coll__pin">
        <div className="blob coll__blob coll__blob--a" aria-hidden="true" />
        <div className="blob coll__blob coll__blob--b" aria-hidden="true" />
        <div className="coll__ghost display" aria-hidden="true">{p.name[0]}</div>

        <header className="coll__title">
          <p className="eyebrow">The KUPPA collection · 0{active + 1}/03</p>
          <h2 id="coll-title">
            <span className="mask"><span>Pick your</span></span>
            <span className="mask"><span>mood.</span></span>
          </h2>
        </header>

        <div className="coll__stagewrap" ref={stageRef}>
          <div className="coll__float">
            <div className="coll__stage">
              <div className="coll__tilt" ref={tiltRef}>
                {PRODUCTS.map((prod, i) => (
                  <div key={prod.id} className="coll__bag" aria-hidden={i !== active}>
                    <Bag product={prod} className="coll__bag-svg" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Sparkle className="coll__spark coll__spark--1" />
          <Sparkle className="coll__spark coll__spark--2" color="#F8EADB" />
        </div>

        <div className="coll__info" aria-live="polite">
          <p className="eyebrow" data-anim>{p.origin} · {p.process}</p>
          <h3 className="coll__name" data-anim>{p.name[0]} <br />{p.name[1]}</h3>
          <ul className="coll__notes" aria-label="Tasting notes">
            {p.notes.map((n) => <li key={n} className="coll__note">{n}</li>)}
          </ul>
          <p className="coll__desc" data-anim>{p.description}</p>
          <p className="coll__mood" data-anim>{p.mood}</p>
          <div data-anim>
            <MagButton variant={p.theme.btn === 'cream' ? 'cream' : 'default'} onClick={() => discover(p.id)}>Discover</MagButton>
          </div>
        </div>

        <div className="coll__controls">
          <button className="icon-btn" onClick={() => go(active - 1)} aria-label="Previous coffee"><Arrow dir="left" /></button>
          <div role="tablist" aria-label="Choose a coffee" className="coll__tabs">
            {PRODUCTS.map((prod, i) => (
              <button
                key={prod.id}
                role="tab"
                aria-selected={i === active}
                className={`coll__tab ${i === active ? 'is-active' : ''}`}
                onClick={() => go(i)}
              >
                {prod.name.join(' ')}
              </button>
            ))}
          </div>
          <button className="icon-btn" onClick={() => go(active + 1)} aria-label="Next coffee"><Arrow /></button>
        </div>
      </div>
    </section>
  );
}
