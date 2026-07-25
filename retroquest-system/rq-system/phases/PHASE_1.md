# Phase 1 — Foundation: Supabase + Skeleton Backend

## Goal
A deployed, empty-but-real pipe: Render-hosted Express app, talking to a fresh Supabase
Postgres database via Prisma, with Supabase Auth verification wired (not full register/
login flows yet — that's Phase 2). At the end of this phase, `/api/health` responds from
the real Render deployment, and a Supabase-issued JWT can be verified by that deployed app.

No feature logic. No task CRUD. No gamification. This phase proves the pipe works.

## Prerequisites
Phase 0 Definition of Done fully met in STATE.json — do not start otherwise.

You will need the user to create the actual Supabase project and Render service and
provide connection strings/env vars — you cannot do this yourself. Ask for exactly what's
needed rather than guessing variable names or current API shapes (Supabase's recommended
connection-string format and JWT verification approach have changed over time — verify
current docs rather than relying on training-data memory, per CLAUDE.md §3).

---

## Task 1.1 — Supabase project setup (user-driven, agent guides and verifies)

**Sub-tasks:**
- Confirm with the user: fresh Supabase project created, sensible region chosen.
- Confirm Google OAuth provider enabled in Supabase Auth settings (user does this in the
  Supabase dashboard — agent verifies via a check, doesn't assume).
- Get the DB connection string appropriate for a long-lived Express server (not the
  serverless/edge-optimized one) — check current Supabase docs for which connection
  string variant this is; this distinction matters and has had more than one correct
  answer depending on Supabase's product changes over time.

**Gate categories that apply:** Functional correctness

**Gate — exact checks:**
- [ ] Functional: `npx prisma db pull` (or equivalent connectivity probe) succeeds against
      the real Supabase instance — paste real output

---

## Task 1.2 — New Prisma schema reflecting the Supabase Auth split

**Sub-tasks:**
- Design `public.user_profiles`: `id` (uuid, references `auth.users.id`, primary key),
  plus `username`, `points`, `level`, `streak_count`, `pokemon_pet_id`, timestamps.
  Supabase's `auth.users` is Supabase-managed — reference its `id` only, never model or
  migrate it via Prisma.
- Put points/level directly on `user_profiles` as a single table — do not split
  points/level tracking across two tables. The original app's `users.points` vs
  `gamification.points` split caused a real, confirmed bug (values silently drifted apart
  whenever a quest-completion bonus updated one table but not the other). Don't recreate
  that shape.
- Every FK that used to point at the old integer `userId` now points at the uuid instead.
- Stub Pokémon/quest tables minimally if needed for FK consistency only — full design is
  each system's own future phase.

**Gate categories that apply:** Build/Compile, Data integrity, Scalability/structure

**Gate — exact checks:**
- [ ] Build: `npx prisma migrate dev` runs clean against the real Supabase DB — paste
      real output
- [ ] Data integrity: confirm (via `npx prisma studio` or a direct query) that no table
      tracks points/level in more than one place
- [ ] Structure: every user-owned table's FK type is uuid, confirmed by reading the
      generated migration SQL, not just the schema file

**Edge cases to check:**
- What happens to a `user_profiles` row if the corresponding `auth.users` row is
  deleted? Decide the FK's `onDelete` behavior explicitly (cascade vs restrict) rather
  than leaving it at whatever Prisma's default is — state the choice and why in the task
  notes.

---

## Task 1.3 — Express skeleton on the surviving backend base

**Sub-tasks:**
- Minimal Express app: cors, json middleware, one shared Prisma client instance (single
  file, imported everywhere), one `/api/health` route.
- Supabase JWT verification middleware: verifies `Authorization: Bearer <token>` against
  Supabase's current recommended verification method (check current docs — don't assume).
- No register/login routes yet.

**Gate categories that apply:** Functional correctness, Security/ownership boundaries,
Scalability/structure

**Gate — exact checks:**
- [ ] Functional: a test route protected by the middleware returns 200 for a real,
      valid Supabase session token (obtained via dashboard test tools or a throwaway
      sign-in) — paste real output
- [ ] Security: the same route returns 401 for a missing token — paste real output
- [ ] Security: the same route returns 401/403 for a malformed or expired token, not a
      500 or an unhandled crash — paste real output
- [ ] Structure: confirm exactly one Prisma client instantiation site in the whole
      backend (`grep -r "new PrismaClient(" backend/` — or use `scripts/gate_check.sh`)

**Edge cases to check:**
- Token with valid signature but for a different Supabase project (shouldn't verify) —
  worth at least reasoning through whether the verification method checks issuer/audience,
  even if you can't easily generate a real cross-project token to test.
- Token that's well-formed JWT syntax but garbage signature — should 401, not crash.

---

## Task 1.4 — Deploy to Render

**Sub-tasks:**
- Produce `render.yaml` or the equivalent config (agent produces this; account/service
  creation is user-driven).
- Set env vars on Render (DATABASE_URL, Supabase JWT secret/verification config, etc. —
  list exactly what's needed, don't guess).
- Deploy, confirm `/api/health` responds from the real `*.onrender.com` URL.

**Gate categories that apply:** Functional correctness, Regression

**Gate — exact checks:**
- [ ] Functional: `curl` against the live Render URL's `/api/health` — paste real output,
      not "should work"
- [ ] Functional: re-run Task 1.3's auth gate checks against the deployed URL, not just
      localhost — a deployed environment can behave differently (env vars missing, CORS,
      etc.)

---

## Definition of Done (Phase 1)
- [ ] Supabase project live, Google OAuth provider enabled, schema migrated, evidence
      recorded
- [ ] Single Express app, single Prisma client, deployed and reachable on Render
- [ ] Supabase-issued JWT verified server-side against the deployed app (not just
      localhost)
- [ ] Zero feature logic — confirmed by reviewing the diff for scope creep
- [ ] STATE.json fully updated for all four tasks with real gate results
- [ ] `phases/PHASE_1_SUMMARY.md` generated before advancing to Phase 2
