# Vero Salon Warm Modern Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the Vero Salon site to a Warm Modern / Honey & Amber / Friendly & Rounded look by rewriting `globals.css` into one clean token-driven sheet and swapping the font to Poppins, with no functional changes.

**Architecture:** Clean rebuild (Approach 1). `globals.css` is rewritten from scratch: a single light + dark token block, then component styles for only the class names actually used in JSX. All dead travel-app template CSS is removed and the two-layer override structure is collapsed. Component `.tsx` files get light touches only (font wiring, removing serif hooks, small ornament). Routes, data, server actions, booking logic, and tests are untouched.

**Tech Stack:** Next.js 16 (App Router, Turbopack), React 19, Tailwind v4 (`@import "tailwindcss"` + CSS custom properties), `next/font/google` (Poppins), Vitest, Playwright.

**Verification net (no CSS unit tests exist — this is the "test" for every task):**
- `npm run typecheck` → clean
- `npm run build` → succeeds, all routes + `ƒ Proxy (Middleware)` present
- `npm test` → 18 passed
- Visual check in `npm run dev` at http://localhost:3000 (light + dark via theme toggle)

---

## File Structure

| File | Responsibility | Change |
|------|----------------|--------|
| `src/lib/fonts.ts` | Font loading | Rewrite: export only Poppins |
| `src/app/layout.tsx` | Root layout, font wiring | Modify: use Poppins variable only |
| `src/app/globals.css` | Entire visual system | Rewrite from scratch |
| `src/components/site/hero.tsx` | Editorial hero | Light edits: copy/ornament, drop serif-specific bits if any |
| `src/components/site/*.tsx` | Section components | Touch only where `font-editorial` or serif hooks exist |

**Keep-list (157 class tokens in live JSX)** — styles for these must exist in the rewritten CSS. Verify before deleting anything: `grep -rhoE 'className="[^"]*"' src/components src/app`.

**Dead-list (verified 0 references — must NOT appear in rewritten CSS):** `.tripc*`, `.ledger*`, `.stay*`, `.phone*`, `.phone__*`, `.preview*`, `.app__*`, `.app `, `.feat-list*`, `.legend*`, `.bar` budget bars, `.tabs`/trip mock elements.

---

## Task 1: Establish a verified-green baseline

**Files:** none (verification only)

- [ ] **Step 1: Confirm clean tree state**

Run: `git status --short`
Expected: only the pre-existing modified files (globals.css, layout.tsx, page.tsx, hero/how-it-works/img-slot/reveal/story/visit, fonts.ts). No surprises.

- [ ] **Step 2: Run the full net once to record the starting point**

Run: `npm run typecheck && npm run build && npm test`
Expected: typecheck clean; build succeeds with 5 routes + `ƒ Proxy (Middleware)`; `Tests 18 passed (18)`.

If any of these fail BEFORE changes, stop and report — the baseline must be green so later regressions are attributable to the redesign.

---

## Task 2: Swap fonts to Poppins

**Files:**
- Modify: `src/lib/fonts.ts`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Rewrite `src/lib/fonts.ts` to export only Poppins**

```typescript
import { Poppins } from 'next/font/google';

export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});
```

- [ ] **Step 2: Update `src/app/layout.tsx` font import and body class**

Change line 2 from:
```typescript
import { jakarta, fraunces } from '@/lib/fonts';
```
to:
```typescript
import { poppins } from '@/lib/fonts';
```

Change line 15 from:
```tsx
      <body className={`${jakarta.variable} ${fraunces.variable}`}>{children}</body>
```
to:
```tsx
      <body className={poppins.variable}>{children}</body>
```

- [ ] **Step 3: Find every remaining reference to the old font variables**

Run: `grep -rn "font-jakarta\|font-fraunces\|jakarta\|fraunces" src/`
Expected: matches only inside `globals.css` (e.g. `--font-display: var(--font-fraunces)`, `font-family: var(--font-jakarta)`). These are fixed in Task 3. No other `.ts/.tsx` should reference them after this task.

- [ ] **Step 4: Verify typecheck still passes**

Run: `npm run typecheck`
Expected: clean. (Build will look wrong visually until Task 3 — that's expected; CSS still references the removed vars. Do not build-verify here.)

- [ ] **Step 5: Commit**

```bash
git add src/lib/fonts.ts src/app/layout.tsx
git commit -m "feat(redesign): swap site font to Poppins"
```

---

## Task 3: Rewrite globals.css — tokens + base + typography

**Files:**
- Modify (rewrite, top section): `src/app/globals.css`

This task replaces the token blocks, reset, layout, and typography. Component sections are rewritten in Task 4. Work in one editing pass but commit at the end of Task 4 once the file is coherent; commit this task separately only if the file builds.

- [ ] **Step 1: Replace the entire top of the file (everything from `@import` through the old `:root`/`[data-theme="dark"]` token blocks and base styles) with the new tokens + base**

Replace from line 1 down through the end of the original base typography (the `.lead` rule, ~line 196) with:

```css
@import "tailwindcss";

/* ── Vero Salon — Warm Modern theme (light) ─────────────── */
:root {
  --bg:          #F7F1E4;   /* oat/cream page */
  --bg-2:        #F1E8D6;   /* secondary warm surface */
  --surface:     #FFFFFF;   /* cards, panels */
  --accent:      #D99A3D;   /* honey */
  --accent-dark: #B8742A;   /* amber */
  --accent-tint: #FBEFD8;   /* selected / soft fill */
  --fg:          #2E2519;   /* walnut text */
  --fg-2:        #6B5D49;   /* secondary text */
  --fg-muted:    #A89570;   /* muted / labels */
  --line:        #EBE2CF;   /* hairline border */

  --font-sans: var(--font-poppins), system-ui, -apple-system, sans-serif;

  --radius-sm:   12px;
  --radius-md:   16px;
  --radius-lg:   20px;
  --radius-pill: 999px;

  --shadow-sm:   0 2px 8px rgba(46,37,25,.06);
  --shadow-card: 0 14px 40px -18px rgba(184,116,42,.28);

  --maxw: 1240px;
  --ease: cubic-bezier(.22,.61,.36,1);

  color-scheme: light;
}

/* ── Warm Modern theme (dark) ───────────────────────────── */
[data-theme="dark"] {
  --bg:          #1C1611;
  --bg-2:        #241C15;
  --surface:     #2A2018;
  --accent:      #E8B05A;
  --accent-dark: #C98F3D;
  --accent-tint: rgba(232,176,90,.14);
  --fg:          #F5ECDD;
  --fg-2:        #C7B7A0;
  --fg-muted:    #9A876C;
  --line:        #3A2E22;
  --shadow-card: 0 14px 40px -18px rgba(0,0,0,.5);
  color-scheme: dark;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  font-family: var(--font-sans);
  background: var(--bg);
  color: var(--fg);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  overflow-x: hidden;
  transition: background-color .4s var(--ease), color .4s var(--ease);
}
img { display: block; max-width: 100%; }
a { color: inherit; text-decoration: none; }

body::before {
  content: ""; position: fixed; inset: 0; pointer-events: none; z-index: -1;
  background:
    radial-gradient(1100px 720px at 86% -8%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 60%),
    radial-gradient(900px 680px at -8% 110%, color-mix(in srgb, var(--accent-dark) 12%, transparent), transparent 62%);
}

.wrap { width: 100%; max-width: var(--maxw); margin: 0 auto; padding: 0 28px; }
.section { padding: clamp(72px, 10vw, 140px) 0; }

.eyebrow {
  display: inline-flex; align-items: center; gap: 10px;
  font-size: 12px; font-weight: 600; text-transform: uppercase;
  letter-spacing: .08em; color: var(--accent-dark);
}
.eyebrow::before { content: ""; width: 26px; height: 2px; background: var(--accent); }
.eyebrow.gold { color: var(--accent-dark); }

.h-section {
  font-weight: 700; font-size: clamp(32px, 5vw, 60px);
  letter-spacing: -.025em; line-height: 1.02; margin: 14px 0 0; color: var(--fg);
}
.h-section em { font-style: normal; color: var(--accent-dark); }
.lead { font-size: clamp(16px, 1.6vw, 19px); line-height: 1.6; color: var(--fg-2); max-width: 56ch; }
```

- [ ] **Step 2: Verify no stale token references remain in the file**

Run: `grep -n "font-jakarta\|font-fraunces\|font-display\|--ink\|--cream\|--brand\|--gold\b" src/app/globals.css`
Expected after the full rewrite (Task 4 included): zero matches. At this intermediate point there may still be matches in the not-yet-rewritten component section — that's fine until Task 4 completes. Note them as the work list for Task 4.

---

## Task 4: Rewrite globals.css — component styles (Friendly & Rounded)

**Files:**
- Modify (rewrite, component sections): `src/app/globals.css`

Rewrite every component block below the typography section. Style **only** keep-list classes. Apply the Friendly & Rounded language: pill buttons/chips, generous rounding, honey-tinted shadows, bolder Poppins weights. Delete all dead-list CSS entirely.

- [ ] **Step 1: Buttons — pills**

```css
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 10px;
  font-family: inherit; font-size: 15px; font-weight: 700;
  padding: 14px 26px; border-radius: var(--radius-pill);
  border: 1.5px solid transparent; cursor: pointer; white-space: nowrap;
  transition: transform .15s var(--ease), background .2s, box-shadow .2s, color .2s, border-color .2s;
}
.btn:active { transform: translateY(1px) scale(.99); }
.btn--primary { background: var(--accent); color: #fff; box-shadow: 0 8px 20px -6px color-mix(in srgb, var(--accent) 55%, transparent); }
.btn--primary:hover { background: var(--accent-dark); transform: translateY(-2px); }
.btn--ghost { background: transparent; color: var(--fg); border-color: var(--line); }
.btn--ghost:hover { border-color: var(--accent); color: var(--accent-dark); }
.btn--ghost-light { background: transparent; color: var(--fg); border-color: var(--line); }
.btn--ghost-light:hover { border-color: var(--accent); }
.btn--lg { padding: 16px 30px; font-size: 16px; }
```

- [ ] **Step 2: Rewrite remaining component blocks for keep-list classes**

Port these blocks from the original file, recoloured to the new tokens and reshaped (pills/rounding). Keep selector names identical; change only values:

- Scroll progress (`.progress`) — gradient `var(--accent)` → `var(--accent-dark)`.
- Nav (`.nav`, `.nav__inner`, `.brand`, `.brand__mark`, `.brand__name`, `.nav__links`, `.nav__cta`, `.nav__burger`, `.pole`) — backdrop blur on `--bg`; brand mark in `--accent`; link underline `--accent`.
- Editorial hero (`.ehero`, `.ehero__grid`, `.ehero__copy`, `.ehero__index`, `.ehero__display`, `.ehero__lead`, `.ehero__actions`, `.ehero__link`, `.ehero__facts`, `.ehero__stage`, `.ehero__frame`, `.ehero__vlabel`, `.ehero__caption`, `.ehero__scroll`, `.ehero--in` keyframes) — `.ehero__display` uses Poppins weight 700 (NOT serif); `em` → `--accent-dark`; `--radius-lg` on frame.
- Spline placeholder (`.splinehero*`) — recolour orb/ring gradients to honey/amber.
- Marquee strip (`.strip`, `.strip__track`) — bg `--bg-2`, text `--fg-2`, separator `✦` in `--accent`.
- Stats (`.stats`, `.stat-card`, `.suf`) — white surface cards, `--radius-lg`, honey shadow; `.suf` → `--accent`.
- Section head (`.sec-head`).
- Rail/lookbook (`.rail__head`, `.rail__pin`, `.rail__track`, `.rail__hint`, `.dcard`, `.dcard__body`, `.dcard__grad`, `.dcard__meta`, `.dcard__name`, `.dcard__num`, `.dcard__tag`) — `--radius-lg`; `.dcard__num` → `--accent-dark`.
- How it works (`.how__grid`, `.how__stick`, `.how__visual`, `.how__steps`, `.how__counter`) and step `.k`/`.n` states → `--accent`.
- Services menu (`.menu`, `.menu__col`, `.price-row`, `.name`, `.price`, `.desc`, `.dur`) — `.price` → `--accent-dark`; row hover soft `--bg-2`.
- Team (`.team`, `.barber`, `.barber__body`, `.barber__role`, `.barber__tags`, `.tag`) — `--radius-lg` cards; `.barber__role` → `--accent-dark`.
- Story (`.story`, `.story__grid`, `.story__copy`, `.story__art`, `.story__sign`, `.story__stats`, `.stat`) — bg `--bg-2`; `.story__sign` → `--accent-dark`.
- Quote (`.quote`, `.stars`, `.by`) — Poppins, `em` → `--accent-dark`; `.stars` → `--accent`.
- Booking (`.booking`, `.book__card`, `.book__main`, `.book__aside`, `.book__nav`, `.steps`, `.steps__bar`, `.steps__label`, `.step`, `.step__title`, `.step__hint`, `.choices`, `.choices--2`, `.choice__ic`, `.choice__txt`, `.choice__price`, `.date-row`, `.dow`, `.dom`, `.day`, `.slots`, `.field`, `.fields-2`, `.msg`, `.summary__eyebrow`, `.summary__title`, `.summary__note`, `.sum-row`, `.sum-total`, `.confirm`, `.confirm__check`, `.confirm__ticket`) — pills on chips/slots; selected = `--accent` bg / `--accent-tint` fill; `.choice` and `.slot` `--radius-md`; aside on `--bg-2`.
- CTA (`.cta`, `.cta__title`, `.cta__sub`, `.cta__actions`) — bg `--bg-2`; `.cta__title em` → `--accent-dark`.
- Visit (`.visit__grid`, `.hours`, `.day`, `.contact-row`, `.info-card`, `.map`, `.map__pin`) — `--radius-lg`; today/pin → `--accent-dark`.
- Footer (`.foot`, `.foot__grid`, `.foot__brand`, `.foot__bottom`) — bg `--bg-2`; headings `--accent-dark`.
- Reveal (`.reveal`, `.reveal.in`, `[data-d]`), mobile menu (`.mobile-menu*`), theme toggle (`.theme-toggle`, `.i-sun`, `.i-moon`), loader (`.loader-*`) — recolour to tokens; loader title uses Poppins not serif.
- Custom scrollbar — honey thumb.
- Responsive `@media` blocks (980px, 600px, 920px) and `@media (prefers-reduced-motion: reduce)` — port as-is, removing any dead-list selectors.

- [ ] **Step 3: Delete all dead-list CSS**

Ensure none of these appear anywhere in the file: `.tripc`, `.ledger`, `.stay`, `.phone`, `.preview`, `.app__`, `.feat-list`, `.legend`, the `.bar i` budget bars, `.glass-panel`/`.font-editorial`/`shimmer` if unused.

Run: `grep -nE '\.(tripc|ledger|stay|phone|preview|app__|feat-list|legend)' src/app/globals.css`
Expected: zero matches.

- [ ] **Step 4: Confirm every keep-list class is still styled**

Run:
```bash
grep -rhoE 'className="[^"]*"' src/components src/app | grep -oE '[a-z][a-z0-9_-]+(__[a-z0-9_-]+)?(--[a-z0-9_-]+)?' | sort -u > /tmp/used.txt
for c in $(cat /tmp/used.txt); do grep -q "\.$c\b" src/app/globals.css || echo "MISSING: $c"; done
```
Expected: prints nothing meaningful. Ignore non-CSS tokens like `class`, `active`, `in`, `count`, `ame`, `font-editorial` (utility/state words and removed hooks). Investigate any real component class reported MISSING and add a rule for it.

- [ ] **Step 5: Run the full verification net**

Run: `npm run typecheck && npm run build && npm test`
Expected: typecheck clean; build succeeds with 5 routes + `ƒ Proxy (Middleware)`; `Tests 18 passed (18)`.

- [ ] **Step 6: Verify no stale tokens remain (completes Task 3 Step 2)**

Run: `grep -nE "font-jakarta|font-fraunces|font-display|--ink\b|--cream\b|--brand\b|--gold\b|oxblood|crimson" src/app/globals.css`
Expected: zero matches.

- [ ] **Step 7: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(redesign): rewrite globals.css to Warm Modern theme"
```

---

## Task 5: Component touch-ups — remove serif hooks, add ornament

**Files:**
- Modify: `src/components/site/hero.tsx`
- Modify: any component still using `font-editorial` (find in Step 1)

- [ ] **Step 1: Find lingering serif/editorial class hooks**

Run: `grep -rn "font-editorial\|fraunces\|serif" src/components src/app`
Expected: a short list. For each, the class no longer maps to a serif (we removed it). Remove the `font-editorial` className token where present (it's now a no-op); leave structural classes alone.

- [ ] **Step 2: Refresh hero copy to the warmer voice (optional but on-brand)**

In `src/components/site/hero.tsx`, the current lead leans "quiet luxury." Soften to match Warm/Friendly. Replace lines 46-49:
```tsx
          <p className="ehero__lead">
            A unisex atelier for hair, colour and beauty. Considered cuts, refined
            colour and quiet luxury — for him and for her.
          </p>
```
with:
```tsx
          <p className="ehero__lead">
            A warm, unisex home for hair, colour and beauty in Pasyala. Considered
            cuts and friendly care — for him and for her, unhurried.
          </p>
```

- [ ] **Step 3: Add a small ornament to the brand (Friendly & Rounded touch)**

Only if a `.brand__name` text node exists in `src/components/site/nav.tsx`, append a hairline sparkle. Inspect first:

Run: `grep -n "brand__name" src/components/site/nav.tsx`

If present, add ` <span aria-hidden="true" style={{ color: 'var(--accent)' }}>✦</span>` after the brand name text. If the markup differs, skip — do not force it.

- [ ] **Step 4: Run the full verification net**

Run: `npm run typecheck && npm run build && npm test`
Expected: typecheck clean; build succeeds with 5 routes + middleware; `Tests 18 passed (18)`.

- [ ] **Step 5: Commit**

```bash
git add src/components
git commit -m "feat(redesign): warm copy + ornament, drop serif hooks"
```

---

## Task 6: Visual verification, light + dark

**Files:** none (manual verification)

- [ ] **Step 1: Start the dev server**

Run: `npm run dev` (background)
Open: http://localhost:3000

- [ ] **Step 2: Walk every section in light mode**

Check hero, marquee, stats, services menu, lookbook rail, how-it-works, booking wizard (click through all 4 steps + confirmation), stylists, story, quote, visit, CTA, footer. Confirm: honey/amber accents, pill buttons/chips, rounded cards, walnut text, no oxblood/gold/serif anywhere, no unstyled (raw) elements.

- [ ] **Step 3: Toggle dark mode and repeat**

Click the theme toggle. Confirm warm dark (espresso bg, brightened honey accent), readable text, no light-mode bleed-through.

- [ ] **Step 4: Check contrast on key pairs**

`--fg` on `--bg`, and button label on `--accent`, in both themes. Must read comfortably (AA). If a pair is weak, adjust the token value in `globals.css`, re-run the net (Task 4 Step 5), and re-commit.

- [ ] **Step 5: Final net + finish**

Run: `npm run typecheck && npm run build && npm test`
Expected: all green.

Then use the **superpowers:finishing-a-development-branch** skill to decide how to integrate (merge to `main`, open a PR, etc.). Work is on the `Dev` branch.

---

## Self-Review

**Spec coverage:**
- Warm Modern direction → Tasks 3-5 ✓
- Honey & Amber palette (light + dark tokens) → Task 3 Step 1 ✓
- Friendly & Rounded (pills, rounding, bolder type, ornament) → Task 4 Steps 1-2, Task 5 ✓
- Poppins replaces Jakarta + Fraunces → Task 2 ✓
- Clean rewrite, no override-on-override → Tasks 3-4 (single pass) ✓
- Delete dead travel-app CSS → Task 4 Step 3 ✓
- Keep-list preserved → Task 4 Step 4 ✓
- No functional/route/data/prop changes → enforced by net (Task 1, 4, 5) ✓
- Both themes verified, AA contrast → Task 6 ✓
- typecheck/build/18 tests green → every task's net step ✓

**Placeholder scan:** No "TBD/TODO". Step 2 of Task 4 is a structured port list (selectors + exact recolour rule each), not a vague "style the rest" — acceptable for a mechanical recolour where the source rules already exist in git history and the values are specified per group.

**Type/name consistency:** Token names (`--bg`, `--bg-2`, `--surface`, `--accent`, `--accent-dark`, `--accent-tint`, `--fg`, `--fg-2`, `--fg-muted`, `--line`, `--font-poppins`, `--radius-*`) are defined once in Task 3 Step 1 and referenced consistently in Tasks 4-5. Font export `poppins`/`--font-poppins` matches between fonts.ts (Task 2) and globals.css (Task 3).
