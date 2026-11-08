import { useRef, type ReactNode } from 'react';
import { gsap, useGSAP, prefersReduced, useTilt } from '../lib/motion';
import { Tin, Tote, TakeawayCup, GiftBox, GlassCup, Bean } from '../components/art';
import { MagButton } from '../components/ui';
import { C } from '../lib/data';

function Item({ cls, name, tag, children }: { cls: string; name: string; tag: string; children: ReactNode }) {
  const tilt = useTilt<HTMLDivElement>(8);
  return (
    <li className={`play__item ${cls}`}>
      <div className="play__inner" tabIndex={0} aria-label={`${name} — ${tag}`}>
        <div className="play__tilt" ref={tilt}>{children}</div>
        <span className="play__label" aria-hidden="true">
          <strong>{name}</strong>
          <em>{tag}</em>
        </span>
      </div>
    </li>
  );
}

export default function Lifestyle() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReduced()) return;
      const q = gsap.utils.selector(root);
      const tl = gsap.timeline({ scrollTrigger: { trigger: q('.play')[0], start: 'top 75%' } });
      /* Signature: PRODUCT PLAYGROUND — every product has its own entrance personality */
      tl.from(q('.play__item--tin'), { y: () => -window.innerHeight * 0.8, rotation: -25, duration: 1.4, ease: 'bounce.out' }, 0)
        .from(q('.play__item--tote'), { xPercent: -160, rotation: -18, duration: 1.3, ease: 'expo.out' }, 0.1)
        .from(q('.play__item--cup'), { yPercent: 140, opacity: 0, duration: 1.3, ease: 'back.out(1.4)' }, 0.25)
        .from(q('.play__item--gift'), { rotation: -120, scale: 0.3, opacity: 0, duration: 1.5, ease: 'elastic.out(1, 0.55)' }, 0.35)
        .from(q('.play__item--iced'), { xPercent: 160, rotation: 20, duration: 1.3, ease: 'expo.out' }, 0.45)
        .from(q('.play__bean'), { scale: 0, stagger: 0.06, duration: 0.8, ease: 'back.out(3)' }, 0.9);

      gsap.from(q('.life__title .mask > span'), {
        yPercent: 110, rotation: 4, stagger: 0.1, duration: 1.2, ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 70%' },
      });
      gsap.to(q('.life__marquee-track'), { xPercent: -50, duration: 22, repeat: -1, ease: 'none' });
      gsap.fromTo(q('.life__marquee'), { rotation: -4 }, {
        rotation: 2, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    },
    { scope: root },
  );

  const marq = 'TOTES • TINS • CUPS • GIFT BOXES • GOOD MOODS • ';

  return (
    <section ref={root} id="lifestyle" className="life" aria-labelledby="life-title">
      <div className="life__head">
        <p className="eyebrow">The KUPPA lifestyle</p>
        <h2 id="life-title" className="life__title">
          <span className="mask"><span>More than</span></span>
          <span className="mask"><span>just coffee.</span></span>
        </h2>
        <p className="life__lede">Carry the good mood with you. Everyday objects, designed to make ordinary moments a little more KUPPA.</p>
      </div>

      <ul className="play" aria-label="KUPPA merchandise">
        <Item cls="play__item--tote" name="The Good Tote" tag="Organic canvas">
          <Tote className="play__art" />
        </Item>
        <Item cls="play__item--tin" name="Keep-Fresh Tin" tag="Holds 250g">
          <Tin className="play__art" />
        </Item>
        <Item cls="play__item--cup" name="Takeaway Cup" tag="Reusable · 12oz">
          <TakeawayCup className="play__art" />
        </Item>
        <Item cls="play__item--iced" name="Iced Cup" tag="Clear · 16oz">
          <GlassCup className="play__art" fill={0.7} ice />
        </Item>
        <Item cls="play__item--gift" name="Gift Box" tag="Three coffees + tin">
          <GiftBox className="play__art" />
        </Item>
        {[[38, 8], [62, 88], [8, 86], [92, 18]].map(([x, y], i) => (
          <li key={i} className="play__bean" style={{ left: `${x}%`, top: `${y}%` }} aria-hidden="true">
            <Bean color={i % 2 ? C.cherry : C.espresso} crease={i % 2 ? '#6e2132' : '#2e211d'} />
          </li>
        ))}
      </ul>
      <p className="play__hint" aria-hidden="true">Swipe to browse →</p>

      <div className="life__cta">
        <MagButton href="#collection" size="lg">Shop the good stuff</MagButton>
      </div>

      <div className="life__marquee" aria-hidden="true">
        <div className="life__marquee-track display">
          <span>{marq}{marq}</span>
          <span>{marq}{marq}</span>
        </div>
      </div>
    </section>
  );
}
