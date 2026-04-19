# CORESKILLAI — FULL REDESIGN SPEC
## Study Reference: Linear.app, Framer.com, Vercel.com, v0.dev

---

## DESIGN PHILOSOPHY

**Core principle:** "Make people stay." Every design decision serves this goal.

Inspiration from industry leaders:
- **Linear.app** — Purpose-driven headlines, AI-native positioning, clean whitespace, dark professional aesthetic
- **Framer.com** — Bold typography, gradient text, clear CTAs, social proof done well
- **Vercel.com** — Minimalist dark theme, monospace accents, fast-feeling animations, strong hierarchy
- **v0.dev** — Clean gradients, card-based layout, clear value proposition above the fold

---

## COLOR SYSTEM — 2026 MODERN DARK

```
--bg:           #09090b      ← Near black (ZenBrowser dark mode)
--surface:      #18181b      ← Elevated cards
--surface-alt:  #27272a      ← Hover states, borders
--border:      #3f3f46      ← Subtle dividers
--text:        #fafafa      ← Pure white for headlines
--text-muted:  #a1a1aa      ← Body text, descriptions
--text-subtle: #71717a      ← Secondary info
--accent:      #6366f1      ← Indigo primary (Vercel-style)
--accent-2:    #8b5cf6      ← Violet secondary
--accent-glow: rgba(99,102,241,0.15)  ← Hover glow
--green:       #22c55e      ← Success, online, trust
--yellow:      #eab308      ← Warning, featured
```

**No more:** messy purple nebulas, big blurry glow explosions, oversaturated colors.

---

## TYPOGRAPHY

- **Headlines:** Inter, 800 weight, tight letter-spacing
- **Hero headline:** 56-72px, -0.02em tracking, line-height 1.1
- **Section headlines:** 36-48px, 700 weight
- **Body:** 16-18px, 400 weight, line-height 1.7
- **Mono accents:** JetBrains Mono for badges/prices
- **Subheadings:** 20px, 500 weight, text-zinc-400

---

## STARFIELD — ELITE REDESIGN

**Old (garbage):** 160 nodes, glowR = r*(4-8), neon purple explosions, heavy GPU

**New (elite):**
- 90 small nodes (r: 0.4-1.5px), mostly white with occasional purple/cyan
- Glow: r * 1.5 max (tight, refined halos)
- Very subtle nebula: 0.04 opacity max, just a hint of color in corners
- Mouse repel is gentle, connections are thin (0.3px lines)
- Background: pure #09090b with only the faintest radial gradient for depth
- Comets: small, fast, short trails — quick flashes of light, not slow oozing trails

**Result:** Looks like a professional night sky with subtle depth. Fast, clean, impressive.

---

## HOMEPAGE REDESIGN — SECTION BY SECTION

### SECTION 1: HERO (above fold = everything)

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   [Badge: Free Tools + Premium Products — 0 signups]        │
│                                                              │
│   AI Tools + Digital Products                                │
│   Built for Builders                                         │
│                                                              │
│   10 free AI-powered tools. Premium frameworks for          │
│   autonomous workers. Nothing to sign up for.               │
│                                                              │
│   [🚀 Try Free Tools]  [💎 Browse Products]                  │
│                                                              │
│   ✓ No account required  ✓ 100% browser  ✓ Your data stays  │
│                               on your device                  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Key changes:**
- Badge: smaller, tighter, not full-width rounded pill
- Headline: MUCH bigger (56-72px), tight tracking, maybe gradient on "Built for Builders"
- Sub: clearer, shorter, benefit-focused ("Nothing to sign up for")
- CTAs: bigger, clearer, better hover states
- Trust line: inline with icons, not a paragraph

**Background:** Pure dark with the refined starfield canvas. No purple nebula flood.

---

### SECTION 2: FREE TOOLS (6 tools)

Layout: Clean grid, each tool has:
- Icon (emoji or simple SVG)
- Name
- One-line description  
- Difficulty badge (small, colored)
- "Try free →" link on hover

No card borders that fight for attention. Clean hover reveal.

---

### SECTION 3: SOCIAL PROOF / METRICS

One line of impressive numbers:
```
Trusted by 2,400+ autonomous workers  ·  10 tools  ·  $0 cost to start
```

Clean, credible, not flashy.

---

### SECTION 4: FEATURED PRODUCTS (3 products)

Product cards with:
- Type badge (Framework / System / Swipe File)
- Product name
- One-liner benefit
- Price: ~~$97~~ → $67 (anchor + charm pricing)
- PayPal + Gumroad buttons

Clean, professional, trustworthy.

---

### SECTION 5: WHY CORESKILLAI (3 value props)

Icon + short headline + one-line description:
```
⚡ Instant      🛡️ Private    💎 Premium
Results        First
```

No elaborate cards. Clean alignment.

---

### SECTION 6: SUPPORT CTA

Simple, not guilt-tripping:
```
Like what we build?
Buy a product or send a coffee → paypal.me/ocultmaster9
```

---

## ANIMATIONS — SUBTLE + FAST

- Fade in on scroll: 300ms ease-out, opacity 0→1, translateY 8px→0
- Button hover: scale 1.02, subtle glow, 150ms
- Card hover: border-color shift to accent, 200ms
- No heavy parallax, no slow slides, no busy transitions

---

## MICRO-INTERACTIONS

- CTA buttons: subtle scale + glow on hover
- Product cards: border shifts to accent indigo on hover
- Tool cards: clean hover reveal, not jarring
- All transitions: 150-200ms max, ease-out

---

## MOBILE

- Single column below 768px
- Hero headline: 40px on mobile
- CTAs: full width on mobile
- All padding reduces by ~30% on mobile
- Starfield canvas: lighter on mobile (fewer particles)

---

## IMPLEMENTATION PLAN

1. Write this SPEC.md
2. Rebuild StarField.tsx with the elite design
3. Rewrite page.tsx with new sections
4. Update globals.css with new variables
5. Rebuild ToolCard + ProductCard with cleaner design
6. Deploy + test