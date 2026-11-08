# KUPPA — Good Coffee. Good Mood.

An immersive, animation-driven single-page landing experience for KUPPA, a fictional specialty coffee brand.

**Stack:** React 18 · TypeScript · Vite · GSAP + ScrollTrigger · Lenis smooth scroll

## Run

```bash
npm install
npm run dev      # http://localhost:5178
npm run build    # production build in dist/
```

## Structure

- `src/sections/` — one component per section (Hero, Story, Collection, Flavor, Journey, Lifestyle, Moment, FinalCta, Footer, Nav)
- `src/components/art/` — hand-drawn SVG product art (glass cup, takeaway cup, bags, tin, tote, gift box, flavors)
- `src/lib/motion.ts` — shared motion system (GSAP setup, magnetic hover, tilt, smooth scroll helpers)
- `src/lib/data.ts` — palette, products and flavor content
- `src/styles/` — design tokens and section styles

Respects `prefers-reduced-motion` with static, pin-free layouts.
