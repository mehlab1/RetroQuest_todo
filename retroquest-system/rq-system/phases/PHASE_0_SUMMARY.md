# Phase 0 Summary — Clear the Ground

**Overall status:** PASSED WITH DEFERRED ITEMS

## Definition of Done — checklist

- ✅ Single backend directory remains as the base to build on (no parallel implementations) —
  `api/`, root `routes/`, root `middleware/`, root `config/`, and `backend/routes|middleware|config`
  are all deleted; only `backend/server.js` remains, kept as an Express-setup skeleton per
  `phases/PHASE_0.md`.
- ✅ No orphaned frontend components remain (including test-file references checked) — 5
  components deleted in Task 0.3, zero import or test-file references found for any of them.
- ✅ `npm install` and existing build commands still succeed post-deletion — root `npm install`
  (746 packages), `backend/npm install` (403 packages), `vite build` (production), and
  `npx prisma validate` all verified passing after deletions.
- ✅ `git diff --stat` evidence recorded showing exactly what was removed — captured per-task
  in `state/STATE.json` `gate_results`/`files_changed` and in the two per-task findings docs.
- ✅ `state/STATE.json` fully updated for all four tasks with real gate results.
- ✅ This file generated before advancing to Phase 1.

## Task-by-task results

| Task | Description | Status | Gate categories checked | Result |
|---|---|---|---|---|
| 0.1 | Confirm what's actually live before deleting anything | done | Functional correctness, Scalability/structure | PASS — `api/index.js` confirmed as the sole live Vercel entry point; every Task 0.2/0.3 deletion candidate grepped for static/dynamic imports and `package.json` script references. See `PHASE_0_TASK_0.1_FINDINGS.md`. |
| 0.2 | Delete confirmed-orphaned backend code | done | Build/Compile, Scalability/structure, Regression | PASS — 21 files / 5026 lines deleted; `npm install` succeeds at root and in `backend/`; post-deletion grep clean (only expected `backend/server.js` dangling imports remain); `vite dev` still starts. |
| 0.3 | Delete/mark orphaned frontend files | done | Build/Compile, Scalability/structure | PASS — 5 components deleted; zero remaining references; `vite build` succeeds; `tsc --noEmit` error count went down (net −3, zero new errors), confirmed by diffing against pre-deletion `staging` state. |
| 0.4 | Remove now-dead Prisma models / unused schema cruft | done | Scalability/structure | PASS — full per-model audit against Task 0.2/0.3 deletions in `PHASE_0_TASK_0.4_FINDINGS.md`; removed root schema's dead duplicate `model pokemon_gifs` only; `npx prisma validate` passes. Also **discovered** root and `backend/` `schema.prisma` have diverged into two separate schemas — not fixed here (schema redesign, out of Task 0.4 scope), logged for Phase 1. |

## What was actually verified (evidence, not assertion)

- `vercel.json` read in full: `/api/*` rewrites to `api/index.js`; `.vercelignore` explicitly
  excludes `backend/` from the deploy bundle ("we only need the API folder").
- Grep evidence for every deletion candidate (static imports, dynamic `import()`/`require()`,
  and both `package.json` `scripts` blocks) — zero live importers outside each file's own dead
  cluster, captured in `PHASE_0_TASK_0.1_FINDINGS.md`.
- `git diff --stat --cached` output captured for the Task 0.2 deletion (21 files, 5026
  deletions) before commit.
- `npm install` run to completion at repo root (746 packages, 0 errors) and in `backend/`
  (403 packages, 0 errors) after all Task 0.2 deletions.
- `npm run dev` (vite) started successfully on `:5173` in 344ms after Task 0.2 deletions.
- Re-grep after Task 0.3 deletion (import-statement form + relative-path form + test-file
  scan) — zero matches for all 5 deleted components.
- `npx vite build` (production) succeeded after Task 0.3: 1554 modules transformed, built in
  6.8s.
- `npx tsc --noEmit -p tsconfig.app.json` run twice — once on the Task 0.3 branch, once
  stashed back to pre-deletion `staging` — to prove the deletion introduced zero new type
  errors (26 pre-existing errors on both; 3 of `staging`'s belonged to the now-deleted
  `PokemonSprite.tsx` itself, a net reduction).
- `npx prisma validate` (with a placeholder `DATABASE_URL`, since none is configured in this
  environment) passed against the root schema both before and after removing `pokemon_gifs`.
- Grepped for `prisma.pokemonGif`/`PokemonGif` usage and found 4 live consumers in
  `backend/*.js` utility scripts, confirming `backend/prisma/schema.prisma`'s version is the
  one actually in use, not root's broken duplicate.

## Deferred / known issues carried forward

Both logged in `state/STATE.json` → `known_deferred_items`:

1. **Root vs. `backend/` `schema.prisma` divergence** — two schemas with different naming
   conventions for the same tables (Type-4 clone). Phase 1 must consolidate to one canonical
   schema per CLAUDE.md §4.
2. **`User.password` / `User.googleId` fields** — orphaned by the deleted Passport strategies
   but left in place; Phase 1's Supabase Auth design should determine whether/how these
   survive.

Also in `state/STATE.json` → `cross_phase_notes`:

3. `vercel.json`'s `/api` rewrite still points at the now-deleted `api/index.js` — deploy
   config needs updating once Phase 1/2 stand up the new backend (or gets repointed at Render
   per CLAUDE.md's target stack).

## Regression check against prior phases

Not applicable — Phase 0 is the first phase of this rebuild; there is no prior phase's
Definition of Done to spot-check.

## Recommendation

Ready to proceed to Phase 1, but the three deferred items above (schema divergence,
auth-field redesign, and the dead `vercel.json` rewrite target) should be picked up early in
Phase 1 rather than left to drift further.
