# Admin Space-Filling Layouts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Replace the narrow single-column admin CRUD layouts with space-filling side-by-side layouts: Services/Stylists/Gallery get a **list-left / add-form-right** two-column grid; People rows widen with right-aligned controls; Content's 7 section forms arrange in a 2-column grid. Dashboard & Schedule unchanged.

**Architecture:** CSS-grid-driven with minimal JSX reordering. Each two-column list page (Services, Stylists, Gallery) wraps its existing `<ListToolbar>` + `<CreateForm>` in a new `.acrud` grid container, with the toolbar/list rendered first (left) and the form second (right, sticky). People & Content are pure CSS grid changes on existing markup. Everything collapses to one column under the existing mobile breakpoint.

**Tech Stack:** Next.js 16 App Router, React 19, plain CSS in `src/app/globals.css`. The list pages use a shared `ListToolbar` render-prop component and `useActionState` forms — structure unchanged, only wrapper/order.

---

## Verification model

No unit tests for layout. Each task's gate:
1. **Build gate:** `npm run lint` and `npm run build` both exit 0.
2. **Visual gate (controller/user):** dev server on :3000; confirm the described layout in light + dark, desktop + mobile width.

Behavior must NOT change: all forms (create/edit/delete/role), search, and filter chips keep working — we only move containers.

---

## File structure

| File | Responsibility | Action |
|------|----------------|--------|
| `src/app/globals.css` | New `.acrud`, `.acrud__form`, `.acontent-grid`, refined `.person`; mobile collapses | Modify |
| `src/app/admin/(protected)/services/services-list.tsx` | Wrap toolbar+form in `.acrud`, reorder | Modify |
| `src/app/admin/(protected)/stylists/stylists-list.tsx` | Same wrap/reorder | Modify |
| `src/app/admin/(protected)/gallery/gallery-list.tsx` | Same wrap/reorder | Modify |
| `src/app/admin/(protected)/content/page.tsx` | Wrap the 7 forms in `.acontent-grid` | Modify |
| `src/app/admin/(protected)/people/people-list.tsx` | (verify only — CSS does the work) | Read |

---

## Task 1: Add the layout CSS primitives

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add the CRUD two-column + content grid + people refinement CSS**

Append the following near the existing admin rules (e.g. right after the `.alist` rule, search `.alist { list-style:none`). Add:

```css
/* ── Space-filling CRUD layout: list (left) + add-form (right) ──── */
.acrud { display:grid; grid-template-columns:minmax(0,1.5fr) minmax(280px,.9fr); gap:22px; align-items:start; }
.acrud__list { min-width:0; }
.acrud__form { min-width:0; }
.acrud__form .acard { position:sticky; top:20px; margin:0; }

/* ── Content page: 7 section forms in a 2-up grid ──────────────── */
.acontent-grid { display:grid; grid-template-columns:1fr 1fr; gap:18px; align-items:start; }
.acontent-grid .acard { margin:0; }

/* ── People: full-width rows, controls aligned to the right edge ── */
.person { display:flex; align-items:center; gap:13px; }
.person__id { display:flex; align-items:center; gap:12px; min-width:0; flex:1; }
.person__edit { display:flex; align-items:center; gap:8px; margin-left:auto; }
.person__del { margin-left:4px; }
```

NOTE: there is an existing `.person { display:flex; align-items:center; gap:13px; background:...}`
rule at ~line 717 — do NOT delete its `background/border/padding` declarations. Only the
NEW rules above add `flex`/alignment helpers for `.person__id`, `.person__edit`,
`.person__del`. If `.person__id`/`.person__edit` already have desktop rules, merge rather
than duplicate (keep the existing background/border on `.person`).

- [ ] **Step 2: Add mobile collapse**

Find the mobile admin media block (search `.person { flex-direction:column;` near line 1182 — it's inside an `@media (max-width:...)`). In that SAME media block, add these lines:

```css
  .acrud { grid-template-columns:1fr; gap:18px; }
  .acrud__form .acard { position:static; }
  .acontent-grid { grid-template-columns:1fr; }
  .person__edit { margin-left:0; }
```

(The existing `.person { flex-direction:column; ... }` in that block already handles People stacking — leave it.)

- [ ] **Step 3: Build gate**

Run: `npm run lint` then `npm run build` — both exit 0. (CSS-only; no visual change yet because no markup uses `.acrud` until Task 2.)

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(admin): add space-filling CRUD/content/people layout CSS"
```

---

## Task 2: Services — list left, form right

**Files:**
- Modify: `src/app/admin/(protected)/services/services-list.tsx`

The `ServicesList` component currently returns:
```tsx
    <>
      <CreateForm />
      <ListToolbar ... render={(rows) => <ul className="alist">...</ul>} />
    </>
```

- [ ] **Step 1: Wrap in `.acrud`, list first (left), form second (right)**

Replace the `return (...)` of `ServicesList` (the `<> ... </>` block at the end of the file) with:

```tsx
  return (
    <div className="acrud">
      <div className="acrud__list">
        <ListToolbar
          items={services}
          placeholder="Search services…"
          searchText={(s) => `${s.name} ${s.category} ${s.slug}`}
          chips={chips}
          emptyLabel="No services match your filters."
          render={(rows) => <ul className="alist">{rows.map((s) => <EditRow key={s.id} s={s} />)}</ul>}
        />
      </div>
      <div className="acrud__form">
        <CreateForm />
      </div>
    </div>
  );
```

(`chips`, `CreateForm`, `EditRow`, `ListToolbar` are all already defined/imported in this file — do not change them.)

- [ ] **Step 2: Build gate**

Run: `npm run lint` then `npm run build` — both exit 0.

- [ ] **Step 3: Visual gate**

`http://localhost:3000/admin/services` (light + dark): the searchable list fills the
left/wider column; the "Add a service" form sits in the right column and stays sticky
while scrolling the list. Create/edit/delete and filters still work. Narrow to mobile:
single column, form below the list, form not sticky.

- [ ] **Step 4: Commit**

```bash
git add "src/app/admin/(protected)/services/services-list.tsx"
git commit -m "feat(admin): services list left, add-form right"
```

---

## Task 3: Stylists — list left, form right

**Files:**
- Modify: `src/app/admin/(protected)/stylists/stylists-list.tsx`

- [ ] **Step 1: Read the file and identify the same pattern**

Open `src/app/admin/(protected)/stylists/stylists-list.tsx`. It follows the same
shape as services: a `CreateForm` (a `<form className="acard">`) and a `ListToolbar`
with a `render={(rows) => <ul className="alist">...}` — possibly returned as `<><CreateForm/><ListToolbar/></>`.

- [ ] **Step 2: Wrap in `.acrud`, list first, form second**

Change the component's `return (...)` so the `ListToolbar` block is wrapped in
`<div className="acrud__list">` (first child) and the create-form element is wrapped in
`<div className="acrud__form">` (second child), both inside `<div className="acrud">`,
mirroring Task 2. Keep ALL existing props (items/placeholder/searchText/chips/
emptyLabel/render) and the create form exactly as they are — only move them into the
two wrapper divs and reorder so the list is first.

If the file's structure differs from services in a way that makes this ambiguous (e.g.
extra elements between the form and toolbar), STOP and report NEEDS_CONTEXT with the
current `return` block quoted.

- [ ] **Step 3: Build gate**

Run: `npm run lint` then `npm run build` — both exit 0.

- [ ] **Step 4: Visual gate**

`http://localhost:3000/admin/stylists` — list left, sticky add-form right; behavior
intact; mobile single-column.

- [ ] **Step 5: Commit**

```bash
git add "src/app/admin/(protected)/stylists/stylists-list.tsx"
git commit -m "feat(admin): stylists list left, add-form right"
```

---

## Task 4: Gallery — list left, form right

**Files:**
- Modify: `src/app/admin/(protected)/gallery/gallery-list.tsx`

`GalleryList` currently returns:
```tsx
    <>
      <CreateForm />
      <ListToolbar ... render={(rows) => <ul className="alist">{rows.map((g) => <EditRow key={g.id} g={g} />)}</ul>} />
    </>
```

- [ ] **Step 1: Wrap in `.acrud`, list first, form second**

Replace the `return (...)` of `GalleryList` with:

```tsx
  return (
    <div className="acrud">
      <div className="acrud__list">
        <ListToolbar
          items={items}
          placeholder="Search gallery…"
          searchText={(g) => `${g.title} ${g.tag} ${g.category}`}
          chips={chips}
          emptyLabel="No gallery items match your filters."
          render={(rows) => <ul className="alist">{rows.map((g) => <EditRow key={g.id} g={g} />)}</ul>}
        />
      </div>
      <div className="acrud__form">
        <CreateForm />
      </div>
    </div>
  );
```

- [ ] **Step 2: Build gate**

Run: `npm run lint` then `npm run build` — both exit 0.

- [ ] **Step 3: Visual gate**

`http://localhost:3000/admin/gallery` — list left, sticky add-form right; upload/image
field works; mobile single-column.

- [ ] **Step 4: Commit**

```bash
git add "src/app/admin/(protected)/gallery/gallery-list.tsx"
git commit -m "feat(admin): gallery list left, add-form right"
```

---

## Task 5: Content — 7 forms in a 2-column grid

**Files:**
- Modify: `src/app/admin/(protected)/content/page.tsx`

Currently the 7 forms render as direct children of `.apage`:
```tsx
      <HeroForm content={hero} />
      <StatsForm content={stats} />
      <StoryForm content={story} />
      <QuoteForm content={quote} />
      <CtaForm content={cta} />
      <HoursForm hours={hours} />
      <ContactForm content={contact} />
```

- [ ] **Step 1: Wrap the 7 forms in `.acontent-grid`**

Replace that block (the 7 `*Form` lines) with:

```tsx
      <div className="acontent-grid">
        <HeroForm content={hero} />
        <StatsForm content={stats} />
        <StoryForm content={story} />
        <QuoteForm content={quote} />
        <CtaForm content={cta} />
        <HoursForm hours={hours} />
        <ContactForm content={contact} />
      </div>
```

Leave the `.ahead` header and the `<Link>` above it untouched.

- [ ] **Step 2: Build gate**

Run: `npm run lint` then `npm run build` — both exit 0.

- [ ] **Step 3: Visual gate**

`http://localhost:3000/admin/content` — the 7 section forms arrange 2-up (filling
width), each form still submits independently; mobile single-column.

- [ ] **Step 4: Commit**

```bash
git add "src/app/admin/(protected)/content/page.tsx"
git commit -m "feat(admin): content section forms in a 2-column grid"
```

---

## Task 6: People — verify rows fill width

**Files:**
- Read only: `src/app/admin/(protected)/people/people-list.tsx`

The People CSS (`.person`, `.person__id`, `.person__edit`, `.person__del`) was updated
in Task 1 to make rows span the width with right-aligned controls. The existing markup
already uses those classes (`person`, `person__id`, `person__edit`, `person__del`), so
no JSX change is expected.

- [ ] **Step 1: Confirm markup uses the classes**

Read `src/app/admin/(protected)/people/people-list.tsx`. Confirm each row `<li>` uses
`className="person"`, with `.person__id`, a `<form className="person__edit">`, and a
`<form className="person__del">`. (It does as of this writing.) No edit needed if so.

- [ ] **Step 2: Build + visual gate**

Run: `npm run lint` then `npm run build` — both exit 0.
`http://localhost:3000/admin/people` — rows span the full width: avatar+name left,
role/stylist selects + Save + Delete aligned to the right edge; mobile stacks. Role
change and delete still work.

- [ ] **Step 3: Commit (only if a JSX tweak was needed)**

```bash
git add "src/app/admin/(protected)/people/people-list.tsx"
git commit -m "fix(admin): people row markup for width-filling layout"
```

(If no change was needed, skip this commit.)

---

## Task 7: Final verification

**Files:** none.

- [ ] **Step 1:** `npm run lint && npm run typecheck && npm run build` — all exit 0.
- [ ] **Step 2:** `npm test` — all pass (baseline 81).
- [ ] **Step 3:** Visual sweep light+dark, desktop+mobile: Services, Stylists, Gallery
  (list left / form right sticky), Content (2-up), People (full-width rows). Confirm no
  page overflows horizontally and all CRUD behavior works.
- [ ] **Step 4:** Final commit if any stray fix:

```bash
git add -A
git commit -m "chore(admin): space-fill layout polish"
```

---

## Self-review notes

- **Spec coverage:** Services/Stylists/Gallery list-left·form-right (T2/T3/T4); Content
  2-col (T5); People full-width rows (T1 CSS + T6 verify); Dashboard/Schedule untouched
  (not in any task — intentional). ✅
- **No placeholders:** every code step shows the exact JSX/CSS. T3 intentionally says
  "read first" because the stylists file wasn't quoted verbatim here — guidance, with a
  NEEDS_CONTEXT escape hatch, not a placeholder.
- **Behavior preserved:** only wrapper divs + ordering change; all form actions, props,
  search, and chips are carried over unchanged.
- **Class consistency:** `.acrud`/`.acrud__list`/`.acrud__form`/`.acontent-grid` defined
  in T1 and used in T2-T5; `.person*` refinements in T1 used by T6.
