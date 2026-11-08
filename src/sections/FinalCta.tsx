import { useRef } from 'react';
import { gsap, useGSAP, prefersReduced, isMobile } from '../lib/motion';
import { GlassCup } from '../components/art';
import { MagButton } from '../components/ui';

export default function FinalCta() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const liquid = q('.final__cup .cup__liquid');
      gsap.set(liquid, { y: 345 * 0.14 });
      if (prefersReduced()) return;
      const mobile = isMobile();
      gsap.to(q('.final__cup .cup__wave--front'), { x: -110, duration: 2.2, repeat: -1, ease: 'none' });
      gsap.to(q('.final__cup .cup__wave--back'), { x: 130, duration: 3.4, repeat: -1, ease: 'none' });

      /* Signature: FULL-CIRCLE ENDING — mirrors the hero, played in reverse */
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'center center', scrub: 1 },
      });
      tl.fromTo(q('.final__bg'), { clipPath: 'circle(18% at 50% 60%)' }, { clipPath: 'circle(120% at 50% 60%)', duration: 1, ease: 'power2.out' }, 0)
        .fromTo(q('.final__cupwrap'), { yPercent: -110, rotation: -28, scale: 1.6 }, { yPercent: 0, rotation: 0, scale: 1, duration: 1, ease: 'power2.out' }, 0)
        .fromTo(q('.final__bloom'), { scale: 0, rotation: -40 }, { scale: 1, rotation: 0, duration: 1, stagger: 0.08, ease: 'power2.out' }, 0.2)
        .fromTo(q('.final__l1'), { xPercent: mobile ? 0 : 38, yPercent: mobile ? 60 : 0, scale: 0.6, opacity: 0 }, { xPercent: 0, yPercent: 0, scale: 1, opacity: 1, duration: 0.8, ease: 'power2.out' }, 0.35)
        .fromTo(q('.final__l2'), { xPercent: mobile ? 0 : -38, yPercent: mobile ? -60 : 0, scale: 0.6, opacity: 0 }, { xPercent: 0, yPercent: 0, scale: 1, opacity: 1, duration: 0.8, ease: 'power2.out' }, 0.4)
        .fromTo(q('.final__cuptilt'), { rotationY: -40 }, { rotationY: 0, duration: 0.6 }, 0.6);

      // CTA mask reveal + gentle settle rotation when the scene lands
      const land = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'center 65%' } });
      land
        .fromTo(q('.final__cta'), { clipPath: 'inset(0 100% 0 0 round 999px)' }, { clipPath: 'inset(0 0% 0 0 round 999px)', duration: 1.1, ease: 'expo.out' })
        .from(q('.final__sub'), { y: 20, opacity: 0, duration: 0.8 }, 0.2)
        .to(q('.final__cupspin'), { keyframes: { rotation: [0, -12, 7, -3, 0] }, duration: 1.8, ease: 'sine.inOut' }, 0);

      gsap.to(q('.final__cupfloat'), { y: -14, duration: 2.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="final" className="final" aria-labelledby="final-title">
      <div className="final__bg" aria-hidden="true" />
      <div className="final__bloom final__bloom--1 blob" aria-hidden="true" />
      <div className="final__bloom final__bloom--2 blob" aria-hidden="true" />
      <div className="final__bloom final__bloom--3 blob" aria-hidden="true" />

      <h2 id="final-title" className="final__title">
        <span className="final__l1">Ready to</span>
        <span className="final__l2">sip different?</span>
      </h2>

      <div className="final__cupwrap" aria-hidden="true">
        <div className="final__cupfloat">
          <div className="final__cupspin">
            <div className="final__cuptilt">
              <GlassCup className="final__cup" fill={0.86} />
            </div>
          </div>
        </div>
      </div>

      <div className="final__ctawrap">
        <span className="final__cta">
          <MagButton href="#collection" variant="cream" size="lg">Explore our coffee</MagButton>
        </span>
        <p className="final__sub">Your next good mood starts here.</p>
      </div>
    </section>
  );
}
