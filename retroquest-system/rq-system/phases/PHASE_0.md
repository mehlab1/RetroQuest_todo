# Phase 0 — Clear the Ground

## Goal
Remove every parallel/orphaned implementation before any new code is written. This phase
adds nothing new. Its only output is a smaller, single-implementation codebase and an
accurate `state/STATE.json` record of what was removed and why.

## Why this phase exists
The original codebase had three parallel backend implementations (`api/index.js` [live],
`backend/server.js` + `backend/routes/*` [dead], root `routes/*` [dead]) and two parallel
Passport/JWT auth setups that were never kept in sync. This is "agentic entropy" /
Type-4-clone duplication (see `RESEARCH_NOTES.md`). Deleting first means old-broken and
new-clean code never coexist.

---

## Task 0.1 — Confirm what's actually live before deleting anything

**Sub-tasks:**
- Read the deploy config (`vercel.json` or equivalent) to confirm which entry point is
  actually deployed.
- Grep the whole repo for imports of each deletion candidate to confirm nothing else
  references it.
- Produce a written list: "File X — confirmed orphaned because [grep evidence]" for each
  candidate.

**Gate categories that apply:** Functional correctness, Scalability/structure

**Gate — exact checks:**
- [ ] Functional: the deploy config's actual entry point is identified and stated
      explicitly (not assumed from a prior summary)
- [ ] Structure: for every file about to be deleted in Task 0.2/0.3, a grep result is
      pasted showing zero live importers (or showing the only importer is another file
      also being deleted)

**Edge cases to check:**
- A file might be imported only conditionally (e.g., inside a try/catch, dynamic
  `require()`, or an environment-gated branch) — a naive static grep for `import`/
  `require` can miss this. Check for dynamic import patterns specifically before
  declaring a file orphaned.
- A file might be referenced in `package.json` scripts (e.g., a `"start"` script pointing
  at it) even with no code-level import — check `package.json` scripts too, not just
  source imports.

---

## Task 0.2 — Delete confirmed-orphaned backend code

**Delete (only after 0.1 confirms orphan status):**
- `api/index.js`, `api/index.js.backup`
- root `routes/*.js`
- root `middleware/auth.js`
- root `config/passport.js`
- `backend/config/passport.js`, `backend/middleware/auth.js` (superseded by Supabase
  Auth in Phase 1 — not migrated, replaced)
- `backend/routes/*.js` (rewritten from scratch in Phase 2 against the new schema)

**Keep for reference:** `backend/server.js` as an Express-setup skeleton only — expect to
gut its auth/db logic entirely in Phase 1.

**Gate categories that apply:** Build/Compile, Scalability/structure, Regression

**Gate — exact checks:**
- [ ] Build: `npm install` still completes without error in whatever directories remain
- [ ] Structure: `git status` / `git diff --stat` output pasted showing exactly what was
      deleted
- [ ] Structure: re-run the grep from Task 0.1 post-deletion — zero remaining references
- [ ] Regression: nothing that was working pre-Phase-0 (there shouldn't be much, but
      check e.g. whether the frontend dev server still starts, even if it errors on API
      calls — it should still *start*)

---

## Task 0.3 — Delete/mark orphaned frontend files

**Delete (verify orphan status per Task 0.1's method first):**
- `src/components/ErrorBoundary.tsx`
- `src/components/Header.tsx`
- `src/components/MusicToggle.tsx`
- `src/components/SoundToggle.tsx`
- `src/components/PokemonSprite.tsx`

**Gate categories that apply:** Build/Compile, Scalability/structure

**Gate — exact checks:**
- [ ] Structure: grep confirms zero remaining imports of each deleted file
- [ ] Build: frontend build/typecheck still succeeds after deletion (a component being
      "orphaned" per import search can still be wrong if e.g. it's referenced in a test
      file or a Storybook config — check those locations too, not just `src/`)

**Edge cases to check:**
- Check `*.test.tsx`/`*.test.ts` files for references before deleting — an orphaned-in-
  production component might still have a live test file, which would break the test
  suite even though the app itself builds fine.

---

## Task 0.4 — Remove now-dead Prisma models / unused schema cruft

**Sub-tasks:**
- Read the current `prisma/schema.prisma` fully.
- Identify anything that only existed to support code paths deleted in 0.2/0.3.
- Do NOT redesign schema structure meant to survive into Phase 1's new schema — this task
  removes genuinely dead cruft only. If unsure whether something is dead or about to be
  redesigned, leave it and note it in STATE.json's `known_deferred_items` for Phase 1 to
  pick up.

**Gate categories that apply:** Scalability/structure

**Gate — exact checks:**
- [ ] Structure: list of removed schema elements with one-line justification each, pasted
      into the task's notes

---

## Definition of Done (Phase 0)
- [ ] Single backend directory remains as the base to build on (no parallel implementations)
- [ ] No orphaned frontend components remain (including test-file references checked)
- [ ] `npm install` and existing build commands still succeed post-deletion
- [ ] `git diff --stat` evidence recorded showing exactly what was removed
- [ ] STATE.json fully updated for all four tasks with real gate results
- [ ] `phases/PHASE_0_SUMMARY.md` generated before advancing to Phase 1
