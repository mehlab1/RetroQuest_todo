# Phase 2 — Literal Basics, Seamless

## Goal
A boring, completely correct task manager with zero gamification. Register (email/
password and Google) → log in → create a task → edit → complete/uncomplete → persists
across refresh and across devices. This is the floor everything else stands on.

## Prerequisites
Phase 1 Definition of Done fully met in STATE.json.

---

## Task 2.1 — Auth routes: register, login, session, Google OAuth

**Sub-tasks:**
- Frontend: Supabase JS client for email/password sign-up/sign-in and Google OAuth
  sign-in. Supabase Auth owns credential handling directly — the backend only ever
  verifies tokens (per Phase 1), never handles raw passwords.
- On first sign-in, ensure a `user_profiles` row is created exactly once. Pick ONE
  mechanism (a Supabase Database Webhook/trigger on `auth.users` insert, OR a
  "create-profile-if-missing" check on first authenticated backend request) — document
  which was chosen and why in the task notes. Do not implement both; that reintroduces
  the dual-path problem this whole system exists to prevent (see CLAUDE.md §1).
- Backend: `/api/users/me` returns the current user's profile via the Phase 1 middleware.

**Gate categories that apply:** Functional correctness, Edge cases, Security/ownership
boundaries, Data integrity

**Gate — exact checks:**
- [ ] Functional: real email/password sign-up, confirm a `user_profiles` row exists
      afterward — paste query/screenshot evidence
- [ ] Functional: real Google sign-in, same confirmation
- [ ] Functional: `/api/users/me` returns correct profile for a valid token, 401 for none

**Edge cases to check (each one actually tested, not reasoned about):**
- [ ] Sign-up with an email that already exists — correct user-facing error, not a raw
      500 or a silent duplicate
- [ ] Sign-up, then immediately sign-in before any email verification step completes (if
      Supabase's config requires email confirmation) — confirm the actual behavior matches
      what the UI communicates to the user; don't let the UI claim success if the account
      isn't actually usable yet
- [ ] Two near-simultaneous first-time Google sign-ins for the same brand-new user (double
      -click / slow network retry) — confirm this doesn't create two `user_profiles` rows
      for one `auth.users` id. This is a real race condition class, not a hypothetical —
      test it if you can script two near-concurrent requests, or at minimum verify the
      chosen mechanism (webhook vs check-on-request) is inherently safe against it (e.g.
      a unique constraint on the FK) rather than assuming it's fine
- [ ] Malformed/missing `username` or other required profile field at signup — validated
      server-side, not just client-side (client validation is a UX nicety, never the
      actual gate, per CLAUDE.md §4)

---

## Task 2.2 — Task CRUD, backend

**Sub-tasks:**
- `tasks.ts` route file (per CLAUDE.md structure rules).
- `GET /api/tasks` — list current user's tasks only.
- `POST /api/tasks` — create.
- `PUT /api/tasks/:id` — edit AND/OR completion toggle (state your endpoint-shape
  decision and reasoning in task notes).
- `DELETE /api/tasks/:id` — delete, scoped to owner.
- Every route scoped to `req.user.id` from the verified token — never trust a client-
  supplied user id for ownership.

**Gate categories that apply:** Functional correctness, Edge cases, Security/ownership
boundaries, Data integrity, Scalability/structure

**Gate — exact checks:**
- [ ] Functional: each route exercised with a real request against the real (or
      local-against-real-DB) server — paste real output for all four routes

**Edge cases to check (each one actually tested):**
- [ ] **Cross-user isolation (critical):** create two real test accounts. User A creates
      a task. Attempt to GET/PUT/DELETE that task's id while authenticated as User B —
      confirm rejection (403/404, your choice, but never success). This is the single
      most important check in this task — the original app had exactly this class of gap
      on the Pokémon-catch endpoint (no server-side ownership/eligibility check at all).
      Do not skip this or reason about it abstractly — actually run it with two accounts.
- [ ] Editing/deleting a task id that doesn't exist — 404, not a 500 or silent no-op
- [ ] Creating a task with missing/empty required fields — rejected with a clear error,
      not a silently-created broken row
- [ ] Creating a task with an excessively long title/description — decide and enforce a
      reasonable limit server-side (don't rely on the DB column length alone to fail
      loudly — Postgres will error, but confirm that error becomes a clean 400, not a
      leaked 500 with a stack trace)
- [ ] Rapid double-submit of the same "complete task" action (double-click, or a slow
      network causing a retry) — confirm this doesn't produce inconsistent state or,
      once Phase 3 exists, double-award points. Even though points don't exist yet this
      phase, design the completion-toggle endpoint to be idempotent now rather than
      needing a rework later — e.g., setting `isDone: true` when it's already true should
      be a safe no-op, not an error and not a double side-effect
- [ ] SQL/NoSQL injection-style input in title/description (e.g., strings containing
      `'; DROP TABLE`, or Prisma-breaking characters) — Prisma's parameterized queries
      should handle this by default, but confirm rather than assume; paste the test

---

## Task 2.3 — Task CRUD, frontend

**Sub-tasks:**
- Task list view, create form, edit, complete/uncomplete toggle, delete.
- Loading and error states for each action.
- **Keep the existing visual theme** — this is a reconnection to a new backend, not a
  redesign. Flag and ask before changing visual design, even for things that seem like
  clear improvements.

**Gate categories that apply:** Functional correctness, Edge cases, Regression

**Gate — exact checks:**
- [ ] Functional: create → refresh → still there
- [ ] Functional: complete → refresh → still completed
- [ ] Functional: edit and delete both verified the same way
- [ ] Functional: confirmed on two separate logged-in sessions (different users) that
      tasks don't leak across accounts at the UI level too — this is the frontend
      confirmation of Task 2.2's backend guarantee, not a redundant check to skip

**Edge cases to check:**
- [ ] Network failure mid-action (throttle/disconnect during a save) — the UI shouldn't
      silently claim success; some visible error/retry state should appear
- [ ] Submitting the create-task form with the network already down — shouldn't lose the
      user's typed input on failure

---

## Task 2.4 — No premature gamification

**Sub-tasks:**
- If the frontend expects points/levels/streaks UI, stub with static/zero values, not
  real logic. That's Phase 3's job, deliberately separated so its bugs don't get
  entangled with basic task CRUD correctness.

**Gate categories that apply:** Scalability/structure

**Gate — exact checks:**
- [ ] Structure: grep confirms no points-mutation logic exists outside static stubs

---

## Definition of Done (Phase 2)
- [ ] Register (both methods), log in, create/edit/complete/delete tasks — all persist
      correctly and privately, verified end-to-end on the deployed environment (not just
      localhost)
- [ ] Cross-user data isolation proven with two real test accounts, not assumed
- [ ] Completion toggle is idempotent (safe against double-submit) by design
- [ ] Zero gamification logic wired in yet, confirmed by review
- [ ] Original visual theme intact unless explicitly discussed and approved otherwise
- [ ] STATE.json fully updated for all four tasks with real gate results
- [ ] `phases/PHASE_2_SUMMARY.md` generated before advancing to Phase 3
