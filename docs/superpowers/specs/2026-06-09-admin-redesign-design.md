# Admin Redesign — Warm Editorial + Dark Mode

**Date:** 2026-06-09
**Status:** Approved direction, pending spec review

## Goal

Redesign every admin page with a refined "Warm Editorial" look (Direction A), make
each page fill the full viewport edge-to-edge, brighten light mode for readability
(option B1), and add a working dark-mode toggle to the admin sidebar. This is a
**visual + theming change only** — no business logic, data, or routing changes.

## Decisions (locked)

- **Direction:** A · Warm Editorial (keep brand identity, refine it).
- **Light mode:** B1 "Bright warm" — white content canvas (`#FFFFFF`), subtle warm
  sidebar (`#F4F1EA`), gold as accent. Replaces the washed-out cream-on-cream.
- **Dark mode:** Reuse existing dark palette already defined in `globals.css`.
- **Theme toggle:** In the admin sidebar **footer**, next to "Sign out". Desktop:
  always visible. Mobile: lives in the existing "More" sheet (consistent with the
  public site pattern noted in project memory).
- **Scope:** All admin pages — Dashboard, People, Services, Stylists, Gallery,
  Content, Schedule, Blocked-slots. Plus full-viewport shell.
- **Full-fill:** Every page wrapped so its content grows to fill the viewport height.

## What already exists (reuse, don't rebuild)

- **Theming infra:** `data-theme="dark"` on `<html>`, persisted to `localStorage`
  key `vero-theme`, no-flash `ThemeScript` in the root layout. ✅
- **Dark palette:** `[data-theme="dark"]` token block in `globals.css:19-23`. ✅
- **ThemeToggle component:** `src/components/theme/theme-toggle.tsx` (sun/moon,
  toggles `data-theme`, writes `vero-theme`). Currently used only in public nav. ✅
- **Token-based CSS:** Admin styles already use `var(--bg)`, `var(--surface)`,
  `var(--accent)`, etc. — so dark mode works automatically once tokens are tuned.
- **Full-fill primitives (added earlier this session):** `.shell--admin` viewport
  fill, `.shell__main` flex column, `.apage` grow wrapper, `.aempty` centered
  empty-state. Dashboard already uses these.

## Architecture / approach

The redesign is **CSS-token-driven**. Because admin components already reference CSS
custom properties, the bulk of the visual change happens by:

1. **Retuning the light-mode `:root` tokens** to the B1 bright palette (white surface,
   warm sidebar, darker text for contrast). Dark tokens stay as-is.
2. **Refining admin component CSS** (`.atile`, `.ahead`, tables, forms, list rows,
   empty states) for spacing rhythm, borders, shadows, and hover states — all via
   tokens so both themes benefit.
3. **Applying the `.apage` fill wrapper** to every admin page root (currently only the
   dashboard has it).
4. **Adding `ThemeToggle` to the admin sidebar footer** in the protected layout, and
   into the admin "More" sheet for mobile.
5. **Fixing the clipped sidebar email** (truncate with ellipsis / wrap cleanly).

### Component-by-component

| Area | File(s) | Change |
|------|---------|--------|
| Light tokens | `globals.css` `:root` | B1 bright palette: `--surface`/content white, warm sidebar `--bg-2`, darker `--fg`/`--fg-2` |
| Shell + toggle | `app/admin/(protected)/layout.tsx` | Add `<ThemeToggle/>` in `.side__foot`; fix `.side__name`/email truncation |
| Mobile More sheet | `admin-bottom-nav.tsx` (the More sheet) | Add theme toggle row |
| Stat tiles | `globals.css` `.atile*` | Refined card: gold left-rail, softer shadow, clearer label/number/sub hierarchy |
| Page headers | `globals.css` `.ahead*` | Consistent eyebrow + title + action treatment |
| Tables | `globals.css` (bookings/list rows) | Cleaner rows, headers, hover, spacing |
| Forms | `globals.css` (form-kit, inputs) | Consistent inputs, spacing rhythm, mobile full-width |
| Empty states | each page + `.aempty` | Centered in filled space, consistent copy/styling |
| Per-page fill | all 8 admin `page.tsx` roots | Wrap root in `.apage` |

### Pages (all wrapped in `.apage`, all use refined components)

- **Dashboard** — already filled; apply refined tiles + empty state.
- **People / Services / Stylists** — CRUD list pages: refined toolbar, list rows, edit forms, empty states.
- **Gallery** — image grid: refined cards/thumbnails, upload field.
- **Content** — settings/forms: refined form layout.
- **Schedule** — calendar/schedule view: fill height, refined surface.
- **Blocked-slots** — block form + list: refined form and rows.

### Out of scope

- Public `/login` page (admin login just redirects there). No changes.
- Any data, query, auth, or routing logic.
- Navigation structure / nav items.

## Theme behavior

- Toggle flips `data-theme` on `<html>` and persists to `vero-theme` (existing logic).
- First paint respects saved choice or `prefers-color-scheme` (existing ScriptTheme).
- All admin surfaces read from tokens, so the toggle restyles everything instantly.

## Risks / notes

- **Token retune affects the public site too** (shared `:root`). Mitigation: the B1
  change targets surfaces/contrast that should improve the public site as well, but we
  must visually verify a public page after the token change. If the public site needs
  the old cream, scope the bright palette to `.shell--admin` instead of global `:root`.
- `.atile__n` uses `dangerouslySetInnerHTML` (existing) — keep as-is, no security change.

## Testing / verification

- `npm run lint`, `npm run typecheck`, `npm run build` all green.
- Manual: each admin page in **light and dark**, desktop + mobile width, verifying
  full-fill, contrast, toggle persistence across reload, and empty states centered.
- Confirm public site still looks correct after the shared-token change.

## Success criteria

- Every admin page fills the viewport (no floating card/gutter).
- Light mode is clearly readable (no cream-on-cream wash).
- Dark mode works on every admin page via the sidebar toggle, persists across reloads.
- Brand identity (warm/gold) preserved. No functional regressions.
