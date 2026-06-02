# Vero Salon — Website & Booking System

Production website and account-free booking system for **Vero Salon**, a Hair &
Beauty unisex salon on Attanagalla Road, Pasyala, Sri Lanka. Polished marketing
site, a four-step booking flow with race-proof availability, and an
auth-protected admin dashboard.

## Stack

- **Next.js 16** (App Router, React 19, Server Actions) · TypeScript (strict)
- **Tailwind CSS v4** · custom crimson + black design system (light/dark, no-flash)
- **Framer Motion + Lenis** — parallax hero, 3D coverflow lookbook, pinned steps
- **React Hook Form + Zod** — booking form validation
- **Supabase** (Postgres, Auth, RLS, Realtime) via `@supabase/ssr`
- **Resend** — email confirmations (SMS behind a stubbed interface)
- **Vitest** (unit + integration) · **Playwright** (e2e)
- Deploy on **Vercel**

All prices are in **LKR**.

## Prerequisites

- Node.js 20+
- A Supabase project (Postgres + Auth)
- (Optional) A Resend account for email confirmations

## Environment variables

Copy `.env.example` to `.env` (or `.env.local`) and fill in:

| Variable | Where to find it | Required |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL (`https://<ref>.supabase.co`) | yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → `anon` public key | yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → `service_role` key (**secret**) | yes |
| `SUPABASE_DB_PASSWORD` | Supabase → Settings → Database → password | only for migrations/types |
| `RESEND_API_KEY` | Resend dashboard | optional (email no-ops if unset) |
| `RESEND_FROM_EMAIL` | A verified Resend sender, e.g. `Vero Salon <bookings@yourdomain>` | optional |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` in dev; your domain in prod | yes |

> `.env` / `.env.local` are gitignored. **Never commit real keys.** The
> `service_role` key bypasses RLS and must stay server-only — it is only read in
> Server Actions (`lib/supabase/admin.ts`), never shipped to the browser.

## Setup

```bash
npm install
```

### Database (schema + seed)

Migrations live in `supabase/migrations/`. Apply them to your project with the
Supabase CLI using a direct DB connection string (no `supabase login` needed):

```bash
# 0001_init.sql  — tables, RLS, the double-booking EXCLUDE constraint
# 0002_realtime.sql — adds `bookings` to the realtime publication
npx supabase db push --db-url "postgresql://postgres:<DB_PASSWORD>@db.<ref>.supabase.co:5432/postgres"
```

Then seed the real Vero data (12 services, 4 stylists, business hours, gallery).
`supabase/seed.sql` is the source of truth; apply it via the Supabase SQL editor,
or with any Postgres client against the same connection string.

### Generated types

Database types live in `lib/supabase/types.ts`, hand-authored to match the
migration. To regenerate from the live schema (requires Docker **or** a Supabase
access token):

```bash
# with a local Docker daemon:
npx supabase gen types typescript --db-url "<connection-string>" > lib/supabase/types.ts
# or with an access token + project ref:
SUPABASE_ACCESS_TOKEN=... npx supabase gen types typescript --project-id <ref> > lib/supabase/types.ts
```

Keep `lib/supabase/types.ts` in sync with `supabase/migrations/*.sql`.

### Admin user

The admin dashboard at `/admin` uses Supabase email/password auth. Create the
salon owner's user in **Supabase → Authentication → Users → Add user** (enable
"Auto confirm"), then sign in at `/admin/login`.

## Commands

```bash
npm run dev        # dev server (http://localhost:3000)
npm run build      # production build
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit
npm run lint       # next lint
npm test           # Vitest unit + integration (incl. live double-booking test)
npm run e2e        # Playwright e2e (requires: npm run build first)
```

> `npm test` includes `tests/double-booking.test.ts`, which talks to the real
> database via the service-role key to assert the overlap constraint — it needs
> a populated `.env`. The e2e (`tests/e2e/booking.spec.ts`) creates and cleans up
> a real booking row, so it also needs DB access and a prior `npm run build`.

## How it works

- **Availability** (`lib/availability.ts`) is a pure, unit-tested function: given
  business hours, a service duration, and the busy intervals (confirmed bookings
  + blocked slots), it returns open start times. The `getAvailability` server
  action (`app/book/actions.ts`) feeds it real data; "any stylist" unions every
  stylist's openings.
- **Double-booking protection** is enforced in Postgres by a GiST `EXCLUDE`
  constraint on `bookings` — two confirmed bookings for the same stylist cannot
  overlap. `createBooking` catches the violation (`23P01`) and returns a graceful
  "slot just taken" instead of double-booking. Price and duration are always
  re-derived from the database, never trusted from the client.
- **Notifications** (`lib/notify/`) go through a `Notifier` interface. Resend
  sends the email confirmation; an SMS stub logs a placeholder. Email no-ops
  safely when `RESEND_API_KEY` is unset, so bookings still succeed without it.
- **Admin** (`/admin`) is guarded by a route group; the dashboard lists today's
  and upcoming bookings with live updates (Supabase Realtime) and status
  controls, plus blocked-slot management that the booking availability respects.

## Project structure

```
app/                 # routes: public page, /book actions, /admin (protected)
components/site/      # marketing sections (hero, lookbook, services, …)
components/booking/   # 4-step wizard
components/admin/     # dashboard table, block form
lib/                  # availability, time, validators, queries, notify, supabase clients
supabase/migrations/  # schema + RLS + realtime
supabase/seed.sql     # real Vero data
reference/            # the original static design (visual source of truth)
tests/                # vitest unit/integration; tests/e2e Playwright
```

## Deploy (Vercel)

1. Import the repo into Vercel.
2. Set the same environment variables (Project → Settings → Environment
   Variables). Mark `SUPABASE_SERVICE_ROLE_KEY` and `RESEND_API_KEY` as secret;
   set `NEXT_PUBLIC_SITE_URL` to your production domain.
3. Deploy. The app server-renders public pages and runs Server Actions for
   booking; no extra build config is required.

## Business details (seed)

Vero Salon — Hair & Beauty Unisex · Attanagalla Road, Pasyala (plus code
545H+F6) · open daily 10:00 AM – 12:00 AM · 4.9★ on Google · 077 369 9620 /
071 094 4410 / 075 095 3004 · [Facebook](https://www.facebook.com/SaloonRV/).
