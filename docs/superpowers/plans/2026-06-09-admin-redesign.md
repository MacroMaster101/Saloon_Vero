# Admin Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine every admin page to a brighter "Warm Editorial" look that fills the full viewport, add a dark-mode toggle to the admin sidebar, and fix the clipped sidebar email — without touching the public site or any business logic.

**Architecture:** CSS-token-driven. All admin styling reads from CSS custom properties. A new `.shell--admin`-scoped token override gives the bright B1 light palette (white content canvas, warm sidebar) without changing the shared public `:root`. Dark mode reuses the existing `[data-theme="dark"]` palette. Each page root gets the `.apage` fill wrapper (already proven on the dashboard). The existing `ThemeToggle` component is dropped into the sidebar footer and the mobile "More" sheet.

**Tech Stack:** Next.js 16 (App Router), React 19, plain CSS in `src/app/globals.css`, existing `data-theme` + `vero-theme` localStorage theming.

---

## Verification model for this plan

This is a visual/CSS change, so each task's "test" is a **verification gate**, not a unit test:

1. **Build gate:** `npm run lint` and `npm run build` both exit 0.
2. **Visual gate:** With `npm run dev` running, open the affected admin page at
   `http://localhost:3000/admin/...` and confirm the described result in **both**
   light and dark mode (toggle via the sidebar button once Task 3 lands; before that,
   set `localStorage.setItem('vero-theme','dark')` in devtools and reload).

The dev server is already running on port 3000 (PID may differ). If not, start it:
`npm run dev` (run in background).

---

## File structure

| File | Responsibility | Action |
|------|----------------|--------|
| `src/app/globals.css` | All admin tokens + component styling | Modify (most work here) |
| `src/app/admin/(protected)/layout.tsx` | Sidebar: add toggle, fix email | Modify |
| `src/app/admin/(protected)/admin-bottom-nav.tsx` | Mobile More sheet: add toggle | Modify |
| `src/app/admin/(protected)/people/page.tsx` | Wrap in `.apage` | Modify |
| `src/app/admin/(protected)/services/page.tsx` | Wrap in `.apage` | Modify |
| `src/app/admin/(protected)/stylists/page.tsx` | Wrap in `.apage` | Modify |
| `src/app/admin/(protected)/gallery/page.tsx` | Wrap in `.apage` | Modify |
| `src/app/admin/(protected)/content/page.tsx` | Wrap in `.apage` | Modify |
| `src/app/admin/(protected)/schedule/page.tsx` | Wrap in `.apage` | Modify |
| `src/app/admin/(protected)/blocked-slots/page.tsx` | Wrap in `.apage` | Modify |

`src/components/theme/theme-toggle.tsx` is **reused as-is** (no change).

---

## Task 1: Bright light palette scoped to admin (B1)

**Files:**
- Modify: `src/app/globals.css` (add a new rule after the `[data-theme="dark"]` block, ~line 27)

Scope the brighter B1 light palette to `.shell--admin` so the public site `:root`
is untouched. Dark mode is left alone (the dark block already wins via specificity
when `data-theme="dark"` is set, but we also add an admin-dark refinement for the
sidebar contrast).

- [ ] **Step 1: Add the admin-scoped token overrides**

In `src/app/globals.css`, immediately after the closing `}` of the
`[data-theme="dark"] { ... }` block (line 27), add:

```css
/* ── Admin redesign: bright "Warm Editorial" (B1) ──────────
   Scoped to the admin shell so the public site palette is unchanged.
   Light: white content canvas, subtle warm sidebar, darker text.        */
.shell--admin {
  --bg:#FFFFFF;          /* main content canvas */
  --bg-2:#F4F1EA;        /* sidebar / secondary surface */
  --surface:#FFFFFF;     /* cards, inputs */
  --fg:#1F1A12;          /* primary text — darker for contrast */
  --fg-2:#4A4133;        /* secondary text */
  --fg-muted:#6B6353;    /* muted/labels */
  --line:#E6E0D4;        /* borders */
  --accent-tint:#FBEFD8; /* active-nav / segment tint */
}
[data-theme="dark"] .shell--admin {
  --bg:#1C1611;
  --bg-2:#241C15;
  --surface:#2A2018;
  --fg:#F5ECDD;
  --fg-2:#C7B7A0;
  --fg-muted:#9A876C;
  --line:#3A2E22;
  --accent-tint:rgba(232,176,90,.14);
}
```

- [ ] **Step 2: Build gate**

Run: `npm run lint` then `npm run build`
Expected: both exit 0.

- [ ] **Step 3: Visual gate**

Open `http://localhost:3000/admin`. Light mode: content area is white, sidebar a
subtle warm grey, text crisp and dark, clear panel separation. Set
`localStorage.vero-theme='dark'` + reload: dark palette intact, sidebar darker than
content.

- [ ] **Step 4: Visual gate — public site unchanged**

Open `http://localhost:3000/` (public home). Confirm it looks exactly as before
(still the original cream `:root`, no white-out). This proves scoping worked.

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(admin): bright Warm Editorial light palette scoped to admin shell"
```

---

## Task 2: Refine stat tiles, page headers, and empty state

**Files:**
- Modify: `src/app/globals.css` (`.adash__tiles`, `.atile*` ~lines 713-722; `.ahead*` ~709-710; `.aempty` added earlier)

Polish the shared visual components. All use tokens, so both themes benefit.

- [ ] **Step 1: Refine the stat tiles**

Replace the existing `.atile` rule (line 714-716) and `.atile__k/n/sub` block with:

```css
.atile { background:var(--surface); border:1px solid var(--line); border-left:4px solid var(--accent);
  border-radius:var(--radius-md); padding:18px 18px 16px; box-shadow:0 6px 18px -10px rgba(120,75,20,.22);
  transition:transform .15s var(--ease), box-shadow .2s var(--ease); }
.atile:hover { transform:translateY(-3px); box-shadow:0 12px 26px -12px rgba(120,75,20,.30); }
.atile__k { font-size:10.5px; font-weight:800; letter-spacing:.12em; text-transform:uppercase; color:var(--fg-muted); margin-bottom:10px; }
.atile__n { font-size:34px; font-weight:800; color:var(--fg); letter-spacing:-.03em; line-height:1; }
.atile__n em { color:var(--accent-text); font-style:normal; }
.atile__sub { font-size:11.5px; color:var(--fg-2); margin-top:6px; }
```

(Dark `[data-theme="dark"]` shadow tweak is optional — the rgba is subtle enough on dark.)

- [ ] **Step 2: Refine the page header**

Replace `.ahead__title` (line 710) with:

```css
.ahead__title { font-size:32px; font-weight:800; letter-spacing:-.03em; color:var(--fg); margin:6px 0 0; }
```

- [ ] **Step 3: Refine the empty state**

Find the `.aempty` rule (added earlier this session, near `.shell__main`) and replace with:

```css
.aempty { flex:1 1 auto; display:grid; place-items:center; min-height:280px; }
.aempty .lead { color:var(--fg-muted); font-size:15px; }
```

- [ ] **Step 4: Build gate**

Run: `npm run lint` then `npm run build` — both exit 0.

- [ ] **Step 5: Visual gate**

`http://localhost:3000/admin` — tiles have thicker gold rail, rounded corners, soft
shadow, clear number/label hierarchy; lift on hover. "No bookings yet." sits centered
in the open area. Check light + dark.

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(admin): refine stat tiles, page header, and empty state"
```

---

## Task 3: Add theme toggle to sidebar footer + fix clipped email

**Files:**
- Modify: `src/app/admin/(protected)/layout.tsx` (imports + `.side__foot` ~line 55, `.side__name` ~line 51)
- Modify: `src/app/globals.css` (add `.side__foot` layout + `.side__name` truncation)

- [ ] **Step 1: Import ThemeToggle and place it in the footer**

In `src/app/admin/(protected)/layout.tsx`, add the import after the `Link` import (line 1):

```tsx
import { ThemeToggle } from '@/components/theme/theme-toggle';
```

Replace the `.side__foot` block (line 54-56) with:

```tsx
        <div className="side__foot">
          <form action={signOut}><button className="btn btn--ghost" type="submit"><Icon name="logout" className="ic" /> Sign out</button></form>
          <ThemeToggle />
        </div>
```

- [ ] **Step 2: Lay out the footer + fix email truncation**

In `src/app/globals.css`, find `.side__foot` (search `.side__foot`). Replace its rule with:

```css
.side__foot { margin-top:auto; padding-top:14px; display:flex; align-items:center; gap:10px; }
.side__foot form { flex:1; min-width:0; }
.side__foot .btn { width:100%; }
```

Then replace `.side__name` (line 626) with:

```css
.side__name { font-weight:700; font-size:14.5px; color:var(--fg); line-height:1.2;
  overflow:hidden; text-overflow:ellipsis; white-space:nowrap; min-width:0; max-width:100%; }
```

And ensure the parent `.side__id` clips — replace `.side__id` (line 620) with:

```css
.side__id { display:flex; align-items:center; gap:12px; padding:0 4px 18px; border-bottom:1px solid var(--line); margin-bottom:8px; min-width:0; }
```

- [ ] **Step 3: Build gate**

Run: `npm run lint` then `npm run build` — both exit 0.

- [ ] **Step 4: Visual gate — toggle works + email no longer clipped**

`http://localhost:3000/admin`. A sun/moon button sits next to "Sign out". Click it:
the whole admin flips light↔dark instantly. Reload: the choice persists. The long
email now ends with an ellipsis (`kavisha.lakshan...@gm…`) instead of being cut mid-glyph.

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/(protected)/layout.tsx src/app/globals.css
git commit -m "feat(admin): add theme toggle to sidebar footer; fix clipped email"
```

---

## Task 4: Add theme toggle to the mobile "More" sheet

**Files:**
- Modify: `src/app/admin/(protected)/admin-bottom-nav.tsx` (import + More sheet ~line 55-59)

On mobile the sidebar footer is hidden, so the toggle must also live in the More sheet.

- [ ] **Step 1: Import and add a toggle row**

In `src/app/admin/(protected)/admin-bottom-nav.tsx`, add after the `Icon` import (line 6):

```tsx
import { ThemeToggle } from '@/components/theme/theme-toggle';
```

Replace the sign-out `<form>` block (lines 55-59) with:

```tsx
          <div className="more-sheet__row" style={{ marginTop: 18, display: 'flex', gap: 10, alignItems: 'center' }}>
            <form action={signOut} style={{ flex: 1 }}>
              <button className="btn btn--ghost" type="submit" style={{ width: '100%' }}>
                <Icon name="logout" className="ic" /> Sign out
              </button>
            </form>
            <ThemeToggle />
          </div>
```

- [ ] **Step 2: Build gate**

Run: `npm run lint` then `npm run build` — both exit 0.

- [ ] **Step 3: Visual gate (mobile width)**

Open `http://localhost:3000/admin`, narrow the window to <860px (or devtools device
mode). Tap "More" — the sheet shows the nav links, then a row with "Sign out" and the
theme toggle. Tapping the toggle flips the theme.

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/(protected)/admin-bottom-nav.tsx
git commit -m "feat(admin): add theme toggle to mobile More sheet"
```

---

## Task 5: Wrap every remaining admin page in `.apage` (full-fill)

**Files (each Modify, root `<div>` → `<div className="apage">`):**
- `src/app/admin/(protected)/people/page.tsx`
- `src/app/admin/(protected)/services/page.tsx`
- `src/app/admin/(protected)/stylists/page.tsx`
- `src/app/admin/(protected)/gallery/page.tsx`
- `src/app/admin/(protected)/content/page.tsx`
- `src/app/admin/(protected)/schedule/page.tsx`
- `src/app/admin/(protected)/blocked-slots/page.tsx`

Each page returns a root `<div>` wrapping an `.ahead` header + content. Change that
root to `<div className="apage">` so it grows to fill the viewport (dashboard already
does this).

- [ ] **Step 1: services/page.tsx**

In `src/app/admin/(protected)/services/page.tsx`, change line 11 `<div>` (the one
wrapping `.ahead`) to:

```tsx
    <div className="apage">
```

- [ ] **Step 2: Repeat for the other six pages**

For each of `people`, `stylists`, `gallery`, `content`, `schedule`, `blocked-slots`:
open the page, find the **outermost** `return ( <div> ... )` wrapper that contains the
`.ahead` header, and change that opening `<div>` to `<div className="apage">`. If the
page's root already has a className, append: `className="apage existingClass"`.

(Read each file first to confirm the exact root element — do not assume a bare `<div>`
if the file uses a Fragment or a className; in that case wrap or merge accordingly.)

- [ ] **Step 3: Build gate**

Run: `npm run lint` then `npm run build` — both exit 0.

- [ ] **Step 4: Visual gate — every page fills**

Visit each in turn (light + dark): `/admin/people`, `/admin/services`,
`/admin/stylists`, `/admin/gallery`, `/admin/content`, `/admin/schedule`,
`/admin/blocked-slots`. Confirm content fills to the bottom (no big blank gutter), the
shell spans the full viewport, and nothing overflows horizontally.

- [ ] **Step 5: Commit**

```bash
git add "src/app/admin/(protected)"
git commit -m "feat(admin): full-viewport fill on all admin pages"
```

---

## Task 6: Refine list/CRUD components (toolbar, rows, forms)

**Files:**
- Modify: `src/app/globals.css` (`.arow*` ~779-786, `.acard*` ~740-742, `.ainput/.atextarea` ~747-751, `.toolbar/.search/.chip` ~647-658)

Polish the shared CRUD surfaces used by People/Services/Stylists/Content/Blocked-slots.

- [ ] **Step 1: Refine list rows**

Replace `.arow` (line 779) with:

```css
.arow { background:var(--surface); border:1px solid var(--line); border-radius:var(--radius-md);
  padding:16px 18px; transition:border-color .15s var(--ease), box-shadow .2s var(--ease); }
.arow:hover { border-color:color-mix(in srgb, var(--accent) 45%, var(--line)); box-shadow:0 6px 16px -12px rgba(120,75,20,.25); }
```

- [ ] **Step 2: Refine form cards and inputs**

Replace `.ainput, .atextarea` (line 747) with:

```css
.ainput, .atextarea { width:100%; box-sizing:border-box; padding:11px 13px; border:1.5px solid var(--line);
  border-radius:var(--radius-sm); font-size:14px; color:var(--fg); background:var(--surface);
  transition:border-color .15s var(--ease), box-shadow .15s var(--ease); }
.ainput:focus, .atextarea:focus { outline:none; border-color:var(--accent); background:var(--surface);
  box-shadow:0 0 0 3px var(--accent-tint); }
```

- [ ] **Step 3: Refine search input + chips**

Replace `.search input` (line 650) with:

```css
.search input { width:100%; font-size:14px; color:var(--fg); background:var(--surface);
  border:1.5px solid var(--line); border-radius:var(--radius-pill); padding:10px 14px 10px 36px;
  transition:border-color .15s var(--ease); }
```

- [ ] **Step 4: Build gate**

Run: `npm run lint` then `npm run build` — both exit 0.

- [ ] **Step 5: Visual gate**

`/admin/services` and `/admin/people` (light + dark): list rows have rounded corners
and a subtle hover lift; expand an edit row and confirm inputs have a clean focus ring;
search pill and filter chips read clearly.

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(admin): refine list rows, forms, and toolbar"
```

---

## Task 7: Final full verification pass

**Files:** none (verification only)

- [ ] **Step 1: Full build gate**

Run: `npm run lint && npm run typecheck && npm run build`
Expected: all exit 0.

- [ ] **Step 2: Run unit tests (no regressions)**

Run: `npm test`
Expected: all pass (baseline was 81 passing).

- [ ] **Step 3: Cross-page visual sweep**

With dev running, walk every admin page in **light then dark**, desktop then mobile
width. Checklist per page: fills viewport · no horizontal overflow · text readable ·
cards/forms styled · empty states centered · toggle persists across reload.

- [ ] **Step 4: Public site regression check**

Open `http://localhost:3000/` and one inner public page. Confirm unchanged (the
admin token scoping must not have leaked).

- [ ] **Step 5: Final commit (if any stray fixes)**

```bash
git add -A
git commit -m "chore(admin): final redesign polish + verification"
```

---

## Self-review notes

- **Spec coverage:** bright light palette (T1), dark reuse (T1), tiles/header/empty (T2),
  sidebar toggle + email fix (T3), mobile toggle (T4), full-fill all pages (T5),
  list/form refinement (T6), verification incl. public-site regression (T1.S4, T7.S4). ✅
- **Shared-token risk** from the spec is resolved by scoping to `.shell--admin` rather
  than editing the public `:root`. ✅
- **No placeholders:** every CSS/TSX step shows the actual code. T5.S2 intentionally
  instructs reading each file first because page roots vary (Fragment vs div vs
  className) — this is guidance, not a placeholder.
- **Type/selector consistency:** `ThemeToggle` import path, `.apage`/`.aempty`/
  `.shell--admin` selectors, and `vero-theme` key match the spec and existing code.
