import { useRef } from 'react';
import { gsap, useGSAP, prefersReduced, finePointer, scrollToTarget } from '../lib/motion';
import { Bean } from '../components/art';

const NAV = [
  { href: '#collection', label: 'Our Coffee' },
  { href: '#story', label: 'Our Story' },
  { href: '#journey', label: 'The Good Stuff' },
  { href: '#lifestyle', label: 'Merch' },
];
const SOCIAL = [
  { href: 'https://www.instagram.com/', label: 'Instagram' },
  { href: 'https://www.tiktok.com/', label: 'TikTok' },
  { href: 'https://www.pinterest.com/', label: 'Pinterest' },
];

export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReduced()) return;
      const q = gsap.utils.selector(root);
      const letters = q('.foot__letter') as HTMLElement[];
      gsap.from(q('.foot__letter-in'), {
        yPercent: 105, stagger: 0.07, duration: 1.3, ease: 'expo.out',
        scrollTrigger: { trigger: q('.foot__mark')[0], start: 'top 95%' },
      });
      gsap.from(q('.foot__cols > *'), {
        y: 30, opacity: 0, stagger: 0.08, duration: 0.9,
        scrollTrigger: { trigger: root.current, start: 'top 85%' },
      });
      // a little bean rolls along the baseline as you reach the end
      gsap.fromTo(q('.foot__bean'), { left: '0%', rotation: 0 }, {
        left: '100%', rotation: 900, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: 1 },
      });

      if (finePointer()) {
        const ys = letters.map((l) => gsap.quickTo(l, 'y', { duration: 0.7, ease: 'power3.out' }));
        const rs = letters.map((l) => gsap.quickTo(l, 'rotation', { duration: 0.7, ease: 'power3.out' }));
        const mark = q('.foot__mark')[0] as HTMLElement;
        const move = (e: PointerEvent) => {
          letters.forEach((l, i) => {
            const r = l.getBoundingClientRect();
            const dx = e.clientX - (r.left + r.width / 2);
            const dy = e.clientY - (r.top + r.height / 2);
            const f = Math.max(0, 1 - Math.hypot(dx, dy) / (r.width * 1.6));
            ys[i](-f * r.height * 0.14);
            rs[i]((dx / r.width) * -6 * f);
          });
        };
        const leave = () => { ys.forEach((y) => y(0)); rs.forEach((r) => r(0)); };
        mark.addEventListener('pointermove', move);
        mark.addEventListener('pointerleave', leave);
        return () => { mark.removeEventListener('pointermove', move); mark.removeEventListener('pointerleave', leave); };
      }
    },
    { scope: root },
  );

  return (
    <footer ref={root} className="foot" aria-label="Footer">
      <div className="foot__cols">
        <div className="foot__brand">
          <p className="foot__tag display">Good coffee.<br />Good mood.</p>
          <p className="foot__small">Coffee for the curious ones. Roasted with character, packed with good intentions.</p>
        </div>
        <nav aria-label="Footer">
          <p className="eyebrow">Explore</p>
          <ul>
            {NAV.map((n) => (
              <li key={n.href}>
                <a className="foot__link" href={n.href} onClick={(e) => { e.preventDefault(); scrollToTarget(n.href); }}>{n.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="eyebrow">Say hi</p>
          <ul>
            {SOCIAL.map((s) => (
              <li key={s.href}>
                <a className="foot__link" href={s.href} target="_blank" rel="noopener noreferrer">{s.label} <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow">Back to the start</p>
          <button className="foot__top" onClick={() => scrollToTarget(0)}>Pour another ↑</button>
        </div>
      </div>

      <div className="foot__mark" aria-label="KUPPA" role="img">
        {'KUPPA'.split('').map((l, i) => (
          <span key={i} className="foot__letter" aria-hidden="true"><span className="foot__letter-in">{l}</span></span>
        ))}
      </div>
      <div className="foot__base">
        <span className="foot__bean" aria-hidden="true"><Bean /></span>
      </div>
      <div className="foot__legal">
        <span>© 2026 KUPPA Coffee Co. A fictional brand, brewed for fun.</span>
        <span>Life is better with KUPPA.</span>
      </div>
    </footer>
  );
}
