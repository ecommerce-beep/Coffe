import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP, scrollToTarget, getLenis, useMagnetic, prefersReduced } from '../lib/motion';
import { MagButton } from '../components/ui';

const LINKS = [
  { href: '#collection', label: 'Our Coffee' },
  { href: '#story', label: 'Our Story' },
  { href: '#journey', label: 'The Good Stuff' },
];

function NavLink({ href, label, onNavigate }: { href: string; label: string; onNavigate?: () => void }) {
  const ref = useMagnetic<HTMLAnchorElement>(0.25);
  return (
    <a
      ref={ref}
      className="nav__link"
      href={href}
      onClick={(e) => {
        e.preventDefault();
        onNavigate?.();
        scrollToTarget(href);
      }}
    >
      {label}
    </a>
  );
}

export default function Nav() {
  const root = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  useGSAP(
    () => {
      ScrollTrigger.create({
        start: 80,
        end: 'max',
        toggleClass: { targets: root.current!, className: 'is-pill' },
      });
    },
    { scope: root },
  );

  // mobile menu: animation, scroll lock, focus trap, Escape
  useEffect(() => {
    const m = menu.current;
    if (!m) return;
    const lenis = getLenis();
    const links = m.querySelectorAll<HTMLElement>('a, button');
    if (open) {
      lenis?.stop();
      gsap.set(m, { visibility: 'visible' });
      gsap.fromTo(m, { clipPath: 'circle(0% at 92% 4%)' }, { clipPath: 'circle(150% at 92% 4%)', duration: prefersReduced() ? 0 : 0.8, ease: 'expo.out' });
      gsap.fromTo(m.querySelectorAll('.menu__item'), { yPercent: 110 }, { yPercent: 0, stagger: 0.06, delay: 0.15, duration: 0.8, ease: 'expo.out' });
      links[0]?.focus();
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') { setOpen(false); toggle.current?.focus(); }
        if (e.key === 'Tab') {
          const first = links[0];
          const last = links[links.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      };
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    } else {
      lenis?.start();
      gsap.to(m, {
        clipPath: 'circle(0% at 92% 4%)',
        duration: prefersReduced() ? 0 : 0.5,
        ease: 'power3.in',
        onComplete: () => { gsap.set(m, { visibility: 'hidden' }); },
      });
    }
  }, [open]);

  const close = () => {
    setOpen(false);
    toggle.current?.focus();
  };

  return (
    <header ref={root} className="nav">
      <div className="nav__bar">
        <a
          href="#top"
          className="nav__logo"
          aria-label="KUPPA — back to top"
          onClick={(e) => { e.preventDefault(); scrollToTarget(0); }}
        >
          KUPPA
        </a>
        <nav className="nav__links" aria-label="Primary">
          {LINKS.map((l) => <NavLink key={l.href} {...l} />)}
        </nav>
        <MagButton href="#collection" className="nav__cta" strength={0.2}>Explore</MagButton>
        <button
          ref={toggle}
          className={`nav__burger ${open ? 'is-open' : ''}`}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          <span /><span />
        </button>
      </div>

      <div
        ref={menu}
        id="mobile-menu"
        className="menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
        style={{ visibility: 'hidden' }}
      >
        <button className="menu__close" onClick={close} aria-label="Close menu">
          <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" /></svg>
        </button>
        <nav aria-label="Mobile">
          <ul>
            {[...LINKS, { href: '#final', label: 'Explore' }].map((l) => (
              <li key={l.href} className="mask">
                <a
                  className="menu__item"
                  href={l.href}
                  tabIndex={open ? 0 : -1}
                  onClick={(e) => { e.preventDefault(); setOpen(false); setTimeout(() => scrollToTarget(l.href), 350); }}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="menu__tag">Good coffee. Good mood.</p>
      </div>
    </header>
  );
}
