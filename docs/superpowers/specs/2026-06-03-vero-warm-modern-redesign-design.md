# Vero Salon — "Warm Modern" Redesign

**Date:** 2026-06-03
**Status:** Design — awaiting user review
**Scope:** Visual redesign of the public marketing site + booking wizard shell. Functionality, data, routes, and server actions are unchanged.

## Goal

Replace the current cold "luxury atelier" look (serif display, oxblood/crimson, gold, ivory) with a **warm, friendly, rounded** aesthetic that matches what Vero Salon actually is: a warm, welcoming, unhurried, unisex neighbourhood hair & beauty salon in Pasyala.

The redesign is delivered as a **clean rebuild of the stylesheet** (Approach 1), not another override layer. Component markup stays stable; the styling system is rewritten from scratch into one coherent token-driven sheet.

## Creative direction (decided in brainstorming)

| Decision | Choice |
|----------|--------|
| Direction | **Warm Modern** — soft, approachable, rounded |
| Palette | **Honey & Amber** — oat/cream backgrounds, white surfaces, honey + amber accents, walnut text |
| Personality | **Friendly & Rounded** — pill shapes, bolder type, small ornamental touches, cosy warmth |

### Palette tokens (light)

| Token | Value | Role |
|-------|-------|------|
| `--bg` | `#F7F1E4` | oat/cream page background |
| `--bg-2` | `#F1E8D6` | secondary warm surface (alt sections) |
| `--surface` | `#FFFFFF` | cards, panels |
| `--accent` | `#D99A3D` | honey — primary buttons, links, highlights |
| `--accent-dark` | `#B8742A` | amber — hover/pressed, deep accents |
| `--accent-tint` | `#FBEFD8` | selected states, soft fills |
| `--fg` | `#2E2519` | walnut — primary text |
| `--fg-2` | `#6B5D49` | secondary text |
| `--fg-muted` | `#A89570` | muted/labels |
| `--line` | `#EBE2CF` | hairline borders |

### Palette tokens (dark)

A genuine warm dark mode (not just inverted). Deep walnut/espresso backgrounds, honey accent brightened for contrast.

| Token | Value |
|-------|-------|
| `--bg` | `#1C1611` |
| `--bg-2` | `#241C15` |
| `--surface` | `#2A2018` |
| `--accent` | `#E8B05A` |
| `--accent-dark` | `#C98F3D` |
| `--accent-tint` | `rgba(232,176,90,.14)` |
| `--fg` | `#F5ECDD` |
| `--fg-2` | `#C7B7A0` |
| `--fg-muted` | `#9A876C` |
| `--line` | `#3A2E22` |

Both themes must pass WCAG AA for body text (`--fg` on `--bg`) and for button label (`#fff`/`--fg` on `--accent`).

### Typography

- **Body & headings:** Poppins (geometric, friendly, rounded) is the single type family. It **replaces both** Plus Jakarta Sans (old workhorse) and Fraunces (old serif display) — both are removed from [lib/fonts.ts](src/lib/fonts.ts). No serif in this direction.
- Headings: weight 700; large, tight line-height, slightly negative tracking.
- Body: weight 400/500.
- Eyebrows/labels: 600, uppercase, gentle tracking (~.08em) — softer than the current .26em.
- Load Poppins via `next/font/google` in [lib/fonts.ts](src/lib/fonts.ts); remove the Fraunces export.

### Shape & motion language

- **Rounding:** generous and friendly. `--radius-sm: 12px`, `--radius-md: 16px`, `--radius-lg: 20px`, `--radius-pill: 999px`. Buttons, chips, date/slot selectors, and nav CTA are **pills**.
- **Ornament:** small warm touches (e.g. a ✦/✿ mark beside the brand or CTA), soft shadows in honey tints rather than grey.
- **Motion:** keep the existing reveal-on-scroll, scroll progress, Lenis smooth scroll, and loading screen — they're tasteful and already wired. Recolour them to the warm palette. Respect `prefers-reduced-motion` (already handled).

## Architecture

### What changes

1. **[src/app/globals.css](src/app/globals.css) — full rewrite.** Single coherent file:
   - `:root` token block (light) + `[data-theme="dark"]` token block (dark) — the values above.
   - Base/reset, layout (`.wrap`, `.section`), typography (`.h-section`, `.lead`, `.eyebrow`).
   - Component styles for **only the 157 class tokens actually used in JSX** (verified by grep against `src/`).
   - **Delete all dead travel-app template CSS:** `.tripc*`, `.ledger*`, `.stay*`, `.phone*`, `.preview*`, `.app__*`, `.feat-list*`, `.legend*`, `.bar i` budget bars, the phone-mockup `.preview__grid`, etc. (Confirmed: 0 references in any component.)
   - **Collapse the two-layer override structure** (lines 1–655 base + 656–1246 "editorial layer") into one pass. No override-on-override.

2. **[src/lib/fonts.ts](src/lib/fonts.ts):** export only Poppins (`--font-poppins`). Remove both the Plus Jakarta Sans and Fraunces exports.

3. **[src/app/layout.tsx](src/app/layout.tsx):** update font variable wiring on `<html>`/`<body>` to use only the Poppins variable; drop the Jakarta and Fraunces variable classes.

4. **Component `.tsx` files — light touches only:**
   - Remove `font-editorial` usages / serif-display class hooks that no longer have meaning.
   - Add the small ornamental marks (brand ✦, CTA touches) where the "Friendly & Rounded" direction calls for them.
   - The `ehero` (editorial hero) block: re-skin via CSS to the warm look; keep markup. Headline copy stays.
   - No structural/JSX-logic changes, no prop changes, no data changes.

### What does NOT change

- All routes, server actions, Supabase queries, booking logic, availability, validators, notify.
- The booking wizard's behaviour, steps, and state.
- Admin area functionality.
- Component file structure and names.
- Tests (they should still pass unchanged — they test logic, not CSS).

### Component boundaries (unchanged, restyled)

Each section component (`Hero`, `Marquee`, `Stats`, `Services`, `Lookbook`, `HowItWorks`, `Stylists`, `Story`, `Quote`, `Visit`, `Cta`, `Footer`, `BookingWizard` + steps) keeps its single responsibility and its public surface (props). The redesign touches their *presentation* (class styling, occasional ornament), not their contracts.

## Risks & mitigations

- **Risk:** a class assumed dead is actually used → broken styling. **Mitigation:** keep-list derived by grep from live JSX (157 tokens); dead-list verified at 0 references before deletion.
- **Risk:** dark-mode contrast regressions. **Mitigation:** check AA on the key pairs listed above during implementation.
- **Risk:** large single-file rewrite is hard to review. **Mitigation:** typecheck + production build + 18 unit tests as a regression net; visual pass on every section via `npm run dev`.

## Success criteria

1. Site renders the Warm Modern / Honey & Amber / Friendly & Rounded direction in both light and dark mode.
2. `globals.css` is a single coherent token-driven sheet with **no dead travel-app CSS** and **no override-on-override layering**.
3. Fraunces removed; Poppins is the only display/body family.
4. `npm run typecheck`, `npm run build`, and `npm test` (18 tests) all pass.
5. Every section + the full booking flow verified visually in the browser, light and dark.
6. No changes to routes, data, server actions, or component props.

## Out of scope (YAGNI)

- New sections, new copy beyond ornamental marks, new imagery sourcing.
- Booking flow UX changes.
- Admin redesign (functional area; restyle inherits from tokens but no bespoke work).
- Performance/refactor work beyond removing the dead CSS that this redesign naturally touches.
