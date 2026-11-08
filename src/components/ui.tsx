import type { ReactNode, MouseEvent } from 'react';
import { useMagnetic, scrollToTarget } from '../lib/motion';

type Variant = 'default' | 'cream' | 'butter' | 'ghost';

/** Pill CTA with magnetic hover. Outer span is free for entrance animations. */
export function MagButton({
  children,
  variant = 'default',
  size,
  href,
  onClick,
  className = '',
  ariaLabel,
  strength = 0.3,
}: {
  children: ReactNode;
  variant?: Variant;
  size?: 'lg';
  href?: string;
  onClick?: (e: MouseEvent) => void;
  className?: string;
  ariaLabel?: string;
  strength?: number;
}) {
  const mag = useMagnetic<HTMLSpanElement>(strength);
  const cls = `btn ${variant !== 'default' ? `btn--${variant}` : ''} ${size ? `btn--${size}` : ''}`;
  const inner = (
    <>
      <span className="btn__label">{children}</span>
      <span className="btn__dot" aria-hidden="true" />
    </>
  );
  return (
    <span className={`mag ${className}`}>
      <span ref={mag} style={{ display: 'inline-block' }}>
        {href ? (
          <a
            className={cls}
            href={href}
            aria-label={ariaLabel}
            onClick={(e) => {
              if (href.startsWith('#')) {
                e.preventDefault();
                scrollToTarget(href);
              }
              onClick?.(e);
            }}
          >
            {inner}
          </a>
        ) : (
          <button type="button" className={cls} onClick={onClick} aria-label={ariaLabel}>
            {inner}
          </button>
        )}
      </span>
    </span>
  );
}

/** Splits text into animatable characters (grouped per word so lines never break mid-word),
 *  while keeping it readable for screen readers. */
export function Chars({ text, className = '' }: { text: string; className?: string }) {
  const words = text.split(' ');
  return (
    <span className={className} aria-label={text} role="text">
      {words.map((w, wi) => (
        <span key={wi} aria-hidden="true" style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {w.split('').map((c, i) => (
            <span key={i} className="char">{c}</span>
          ))}
          {wi < words.length - 1 && <span className="char">{'\u00A0'}</span>}
        </span>
      ))}
    </span>
  );
}
