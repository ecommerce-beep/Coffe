import { useRef } from 'react';
import { gsap, useGSAP, prefersReduced, isMobile } from '../lib/motion';
import { Bean, GlassCup } from '../components/art';
import { C } from '../lib/data';

const STEPS = [
  { n: '01', t: 'Sourced with care', d: 'We work with small farms we know by name — paying fairly for coffee picked ripe and sorted by hand.' },
  { n: '02', t: 'Roasted with character', d: 'Small-batch roasts, profiled bean by bean, until sweetness, body and brightness are all smiling.' },
  { n: '03', t: 'Brewed for good moods', d: 'Packed fresh, delivered fast, poured by you. That last step is the most important one.' },
];

export default function Journey() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const liquid = q('.journey__cup .cup__liquid');
      if (prefersReduced()) {
        gsap.set(q('.journey__scene--brew'), { clipPath: 'circle(150% at 50% 50%)' });
        gsap.set(q('.journey__step'), { opacity: 1, position: 'relative' });
        gsap.set(liquid, { y: 345 * 0.18 });
        return;
      }
      const mobile = isMobile();
      gsap.to(q('.journey__cup .cup__wave--front'), { x: -110, duration: 2.2, repeat: -1, ease: 'none' });
      gsap.to(q('.journey__heat'), { y: -50, opacity: 0, duration: 2.2, stagger: 0.4, repeat: -1, ease: 'sine.in' });
      gsap.to(q('.journey__leaf'), { rotation: 12, duration: 2.6, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: 0.3 });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: mobile ? '+=260%' : '+=320%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      const steps = q('.journey__step');
      const dots = q('.journey__dot');
      const showStep = (i: number, at: number) => {
        if (i > 0) tl.to(steps[i - 1], { yPercent: -40, opacity: 0, duration: 0.3 }, at - 0.3);
        tl.fromTo(steps[i], { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }, at)
          .fromTo(steps[i].querySelector('.journey__num'), { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 0.4 }, at)
          .to(dots[i], { scale: 1, backgroundColor: C.cherry, duration: 0.2 }, at);
      };

      /* 01 · sourcing — the bean travels over the hills */
      tl.set(steps, { opacity: 0 });
      showStep(0, 0);
      tl.fromTo(q('.journey__bean'), { xPercent: -260, yPercent: 60, rotation: -120, scale: 0.7 }, { xPercent: 0, yPercent: -10, rotation: 0, scale: 1, duration: 1, ease: 'power1.inOut' }, 0)
        .to(q('.journey__hills'), { xPercent: -12, duration: 1.2 }, 0)
        .to(q('.journey__sun'), { yPercent: -40, duration: 1.2 }, 0)

        /* 02 · roasting — warm scene opens from the bean, bean darkens */
        .fromTo(q('.journey__scene--roast'), { clipPath: 'circle(0% at 50% 48%)' }, { clipPath: 'circle(150% at 50% 48%)', duration: 0.7, ease: 'power2.in' }, 1)
        .to(q('.journey__bean-raw'), { opacity: 0, duration: 0.6 }, 1.1)
        .to(q('.journey__bean'), { rotation: 540, scale: 1.25, duration: 1.2, ease: 'power1.inOut' }, 1)
        .fromTo(q('.journey__drum'), { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.6)' }, 1.2)
        .to(q('.journey__drum-ring'), { rotation: 300, duration: 1.4 }, 1.2);
      showStep(1, 1.2);

      /* 03 · brewing — bean becomes a stream, the stream fills a KUPPA cup */
      tl.fromTo(q('.journey__scene--brew'), { clipPath: 'circle(0% at 50% 30%)' }, { clipPath: 'circle(150% at 50% 30%)', duration: 0.7, ease: 'power2.in' }, 2.3)
        .to(q('.journey__bean'), { yPercent: mobile ? -150 : -170, scale: 0.45, rotation: 720, duration: 0.6, ease: 'power2.inOut' }, 2.4)
        .fromTo(q('.journey__cupwrap'), { yPercent: 120, rotation: 10 }, { yPercent: 0, rotation: 0, duration: 0.6, ease: 'power2.out' }, 2.5)
        .to(q('.journey__bean'), { opacity: 0, scale: 0.2, duration: 0.2 }, 3)
        .fromTo(q('.journey__stream'), { scaleY: 0 }, { scaleY: 1, duration: 0.3, ease: 'power1.in' }, 2.95)
        .fromTo(liquid, { y: 345 }, { y: 345 * 0.16, duration: 1, ease: 'power1.out' }, 3.15)
        .to(q('.journey__stream'), { scaleY: 0, transformOrigin: '50% 100%', duration: 0.3 }, 4.1)
        .to(q('.journey__cupwrap'), { scale: 1.12, rotation: -4, duration: 0.5 }, 4.15);
      showStep(2, 2.6);
      tl.to({}, { duration: 0.3 }); // short hold before releasing the pin
    },
    { scope: root },
  );

  return (
    <section ref={root} id="journey" className="journey" aria-labelledby="journey-title">
      {/* scene 01 */}
      <div className="journey__scene journey__scene--source" aria-hidden="true">
        <div className="journey__sun" />
        <svg className="journey__hills" viewBox="0 0 1600 400" preserveAspectRatio="none">
          <path d="M0 260 C200 160 380 180 560 240 C760 300 920 140 1120 170 C1300 200 1440 260 1600 220 V400 H0 Z" fill="#a9cadb" />
          <path d="M0 320 C240 250 420 300 640 300 C880 300 1040 220 1260 260 C1420 290 1520 300 1600 290 V400 H0 Z" fill={C.cream} opacity="0.8" />
        </svg>
        {[12, 30, 72, 88].map((x, i) => (
          <svg key={i} className="journey__leaf" viewBox="0 0 60 90" style={{ left: `${x}%`, bottom: `${18 + (i % 2) * 8}%` }}>
            <path d="M30 90 C30 60 30 40 30 30" stroke={C.espresso} strokeWidth="4" />
            <path d="M30 40 C0 30 4 4 30 0 C56 4 60 30 30 40 Z" fill={i % 2 ? C.peach : C.butter} />
          </svg>
        ))}
      </div>
      {/* scene 02 */}
      <div className="journey__scene journey__scene--roast" aria-hidden="true">
        <div className="journey__drum">
          <div className="journey__drum-ring" />
        </div>
        {[20, 38, 62, 80].map((x, i) => (
          <svg key={i} className="journey__heat" viewBox="0 0 30 120" style={{ left: `${x}%` }}>
            <path d="M15 120 C0 100 30 80 15 60 C0 40 30 20 15 0" stroke={C.cream} strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.7" />
          </svg>
        ))}
      </div>
      {/* scene 03 */}
      <div className="journey__scene journey__scene--brew" aria-hidden="true">
        <div className="journey__stream" />
        <div className="journey__cupwrap">
          <GlassCup className="journey__cup" fill={0} straw={false} />
        </div>
      </div>

      <div className="journey__bean" aria-hidden="true">
        <Bean color="#8a5a4c" crease="#5a3b33" />
        <div className="journey__bean-raw"><Bean color={C.butter} crease="#d9a43f" /></div>
      </div>

      <div className="journey__copy">
        <h2 id="journey-title" className="journey__title">The good stuff doesn’t happen by accident.</h2>
        <ol className="journey__steps">
          {STEPS.map((s) => (
            <li key={s.n} className="journey__step">
              <span className="journey__num display" aria-hidden="true">{s.n}</span>
              <div>
                <h3 className="journey__step-title">{s.t}</h3>
                <p>{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="journey__dots" aria-hidden="true">
          {STEPS.map((s) => <span key={s.n} className="journey__dot" />)}
        </div>
      </div>
    </section>
  );
}
