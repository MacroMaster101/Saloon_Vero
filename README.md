<div align="center">

# ✂️ Vero Salon

### Hair & Beauty Unisex Salon · Pasyala, Sri Lanka 🇱🇰

**A production website + account-free booking system** — polished marketing site, a four-step booking flow with race-proof availability, and an auth-protected admin dashboard.

<br/>

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)

![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)
![Resend](https://img.shields.io/badge/Resend-000000?style=for-the-badge&logo=resend&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

<br/>

⭐ **4.9 on Google** · 🕙 **Open daily 10 AM – 12 AM** · 💇 **Unisex — him & her** · 💰 **Prices in LKR**

</div>

---

## ✨ Features

| | Feature |
|---|---|
| 🎨 | **Crimson + black design system** — light/dark themes with no flash, Plus Jakarta Sans |
| 🌀 | **Rich motion** — parallax hero, 3D coverflow lookbook, pinned step-through (all reduced-motion aware) |
| 📅 | **4-step booking** — service → stylist → date & time → details, with real server-side availability |
| 🔒 | **Race-proof slots** — a Postgres `EXCLUDE` constraint makes double-booking impossible |
| 📧 | **Email confirmations** — via Resend, with a pluggable SMS stub for later |
| 🛠️ | **Admin dashboard** — live bookings (Realtime), status controls & blocked-slot management |
| ✅ | **Tested** — Vitest unit + integration and a Playwright end-to-end booking flow |

---

## 🧰 Tech Stack

- ⚡ **Next.js 16** — App Router, React 19, Server Actions
- 🟦 **TypeScript** (strict mode)
- 🎨 **Tailwind CSS v4** — custom crimson + black tokens, light/dark, no-flash
- 🌀 **Framer Motion + Lenis** — parallax, coverflow, pinned scroll
- 📝 **React Hook Form + Zod** — typed, validated booking form
- 🗄️ **Supabase** — Postgres · Auth · RLS · Realtime, via `@supabase/ssr`
- 📨 **Resend** — transactional email (SMS behind a stubbed interface)
- 🧪 **Vitest** + **Playwright** — unit, integration & e2e
- ▲ **Vercel** — deployment

---

## 🚀 Quick start

### 📋 Prerequisites

- 🟢 Node.js 20+
- 🗄️ A Supabase project (Postgres + Auth)
- 📨 *(optional)* A Resend account for email confirmations

### 🔑 Environment variables

Copy `.env.example` → `.env` (or `.env.local`) and fill in:

| Variable | Where to find it | Required |
|---|---|:---:|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL (`https://<ref>.supabase.co`) | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → `anon` public key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → `service_role` key 🔐 | ✅ |
| `SUPABASE_DB_PASSWORD` | Supabase → Settings → Database → password | migrations/types |
| `RESEND_API_KEY` | Resend dashboard | optional |
| `RESEND_FROM_EMAIL` | A verified Resend sender, e.g. `Vero Salon <bookings@yourdomain>` | optional |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` in dev; your domain in prod | ✅ |

> ⚠️ `.env` / `.env.local` are gitignored — **never commit real keys.** The `service_role` key bypasses RLS and stays server-only (read only in `lib/supabase/admin.ts`, never shipped to the browser).

### 📦 Install

```bash
npm install
```

### 🗄️ Database (schema + seed)

Apply the migrations with the Supabase CLI using a direct DB connection string (no `supabase login` needed):

```bash
# 0001_init.sql     — tables, RLS, the double-booking EXCLUDE constraint
# 0002_realtime.sql — adds `bookings` to the realtime publication
npx supabase db push --db-url "postgresql://postgres:<DB_PASSWORD>@db.<ref>.supabase.co:5432/postgres"
```

Then seed the real Vero data (12 services · 4 stylists · business hours · gallery). `supabase/seed.sql` is the source of truth — run it via the Supabase SQL editor or any Postgres client.

### 🧬 Generated types

DB types live in `lib/supabase/types.ts` (hand-authored to match the migration). Regenerate from the live schema (needs Docker **or** an access token):

```bash
# with a local Docker daemon:
npx supabase gen types typescript --db-url "<connection-string>" > lib/supabase/types.ts

# or with an access token + project ref:
SUPABASE_ACCESS_TOKEN=... npx supabase gen types typescript --project-id <ref> > lib/supabase/types.ts
```

### 👤 Admin user

The dashboard at `/admin` uses Supabase email/password auth. Create the salon owner in **Supabase → Authentication → Users → Add user** (enable **Auto Confirm**), then sign in at `/admin/login`.

---

## 🧪 Commands

```bash
npm run dev        # 🔥 dev server (http://localhost:3000)
npm run build      # 📦 production build
npm run start      # ▶️  serve the production build
npm run typecheck  # 🟦 tsc --noEmit
npm run lint       # ✨ eslint .
npm test           # 🧪 Vitest unit + integration (incl. live double-booking test)
npm run e2e        # 🎭 Playwright e2e (run `npm run build` first)
```

> 🧠 `npm test` includes `tests/double-booking.test.ts`, which hits the real database via the service-role key to assert the overlap constraint — it needs a populated `.env`. The e2e creates and cleans up a real booking row, so it needs DB access and a prior `npm run build`.

---

## ⚙️ How it works

- 🧮 **Availability** (`lib/availability.ts`) — a pure, unit-tested function: given business hours, a service duration, and busy intervals (confirmed bookings + blocked slots), it returns open start times. The `getAvailability` server action feeds it real data; "any stylist" unions every stylist's openings.
- 🔒 **Double-booking protection** — enforced in Postgres by a GiST `EXCLUDE` constraint, so two confirmed bookings for the same stylist can't overlap. `createBooking` catches the violation (`23P01`) and returns a graceful "slot just taken." Price & duration are always re-derived from the DB — never trusted from the client.
- 📨 **Notifications** (`lib/notify/`) — go through a `Notifier` interface. Resend sends the email; an SMS stub logs a placeholder. Email no-ops safely when `RESEND_API_KEY` is unset, so bookings still succeed without it.
- 🛠️ **Admin** (`/admin`) — guarded by a route group; lists today's & upcoming bookings with live updates (Supabase Realtime) and status controls, plus blocked-slot management that availability respects.

---

## 📂 Project structure

```
app/                  # 🧭 routes: public page, /book actions, /admin (protected)
components/site/       # 🎨 marketing sections (hero, lookbook, services, …)
components/booking/    # 📅 4-step wizard
components/admin/      # 🛠️ dashboard table, block form
lib/                   # 🧰 availability, time, validators, queries, notify, supabase clients
supabase/migrations/   # 🗄️ schema + RLS + realtime
supabase/seed.sql      # 🌱 real Vero data
tests/                 # 🧪 vitest unit/integration; tests/e2e Playwright
```

---

## ▲ Deploy (Vercel)

1. Import the repo into Vercel.
2. Add the same environment variables (Project → Settings → Environment Variables). Mark `SUPABASE_SERVICE_ROLE_KEY` and `RESEND_API_KEY` as **secret**; set `NEXT_PUBLIC_SITE_URL` to your production domain.
3. Deploy 🚀 — public pages are server-rendered and booking runs via Server Actions; no extra build config needed.

---

## 📍 Visit us

<div align="center">

**Vero Salon — Hair & Beauty Unisex**

📌 Attanagalla Road, Pasyala *(plus code 545H+F6)*
🕙 Open daily 10:00 AM – 12:00 AM
📞 077 369 9620 · 071 094 4410 · 075 095 3004
⭐ 4.9 on Google

[![Facebook](https://img.shields.io/badge/Facebook-1877F2?style=for-the-badge&logo=facebook&logoColor=white)](https://www.facebook.com/SaloonRV/)

</div>
