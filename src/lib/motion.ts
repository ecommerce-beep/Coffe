import { useEffect, useRef, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, useGSAP);
gsap.defaults({ ease: 'power3.out', duration: 0.9 });

export { gsap, ScrollTrigger, useGSAP };

/** Shared motion vocabulary — keeps every section speaking the same language. */
export const EASE = {
  out: 'expo.out',
  soft: 'power3.out',
  inOut: 'power2.inOut',
  elastic: 'elastic.out(1, 0.45)',
  spring: 'back.out(1.8)',
};

export const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const isMobile = () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;
export const finePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ---------- smooth scroll singleton ---------- */
let lenis: Lenis | null = null;
export const setLenis = (l: Lenis | null) => (lenis = l);
export const getLenis = () => lenis;

/** Scroll to a section id or absolute y, respecting smooth scroll + reduced motion. */
export function scrollToTarget(target: string | number, opts: { offset?: number; immediate?: boolean } = {}) {
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : null;
  const y = typeof target === 'number' ? target : el ? el.getBoundingClientRect().top + window.scrollY + (opts.offset ?? 0) : 0;
  if (lenis && !prefersReduced()) {
    lenis.scrollTo(y, { duration: 1.6, immediate: opts.immediate, easing: (t) => 1 - Math.pow(1 - t, 4) });
  } else {
    window.scrollTo({ top: y, behavior: prefersReduced() ? 'auto' : 'smooth' });
  }
  if (el && typeof target === 'string') {
    // move keyboard focus to the section for a11y without jumping
    el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  }
}

/* ---------- magnetic hover ---------- */
export function useMagnetic<T extends HTMLElement>(strength = 0.35) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced() || !finePointer()) return;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => { xTo(0); yTo(0); };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [strength]);
  return ref;
}

/* ---------- perspective tilt on hover ---------- */
export function useTilt<T extends HTMLElement>(max = 10, scope?: RefObject<HTMLElement>) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    const area = scope?.current ?? el;
    if (!el || !area || prefersReduced() || !finePointer()) return;
    gsap.set(el, { transformPerspective: 900 });
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.9, ease: 'power3.out' });
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.9, ease: 'power3.out' });
    const move = (e: PointerEvent) => {
      const r = area.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      ry(nx * max * 2);
      rx(-ny * max * 2);
    };
    const leave = () => { rx(0); ry(0); };
    area.addEventListener('pointermove', move);
    area.addEventListener('pointerleave', leave);
    return () => {
      area.removeEventListener('pointermove', move);
      area.removeEventListener('pointerleave', leave);
    };
  }, [max, scope]);
  return ref;
}

/* ---------- deterministic pseudo random (stable layouts across renders) ---------- */
export function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Build a sine-ish wave path for liquid surfaces. */
export function wavePath(y: number, amp: number, wl: number, x0: number, x1: number, bottom: number) {
  let d = `M${x0} ${bottom} L${x0} ${y}`;
  let up = true;
  for (let x = x0; x < x1; x += wl / 2) {
    d += ` Q${x + wl / 4} ${up ? y - amp : y + amp} ${x + wl / 2} ${y}`;
    up = !up;
  }
  d += ` L${x1} ${bottom} Z`;
  return d;
}

/** Organic splash/blob path with a stable command structure (so GSAP can tween `d`). */
export function splashPath(cx: number, cy: number, r: number, points: number, seed: number, spike = 0.35) {
  const rnd = seeded(seed);
  const pts: [number, number][] = [];
  for (let i = 0; i < points; i++) {
    const a = (i / points) * Math.PI * 2;
    const rr = r * (i % 2 === 0 ? 1 + rnd() * spike : 1 - rnd() * spike * 0.5);
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  // smooth closed curve through points (Catmull-Rom → cubic Bézier)
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < points; i++) {
    const p0 = pts[(i - 1 + points) % points];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % points];
    const p3 = pts[(i + 2) % points];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + ' Z';
}

if (import.meta.env.DEV && typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).__ST = ScrollTrigger;
  (window as unknown as Record<string, unknown>).__lenis = () => lenis;
}
