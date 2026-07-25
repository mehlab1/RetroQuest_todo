# RetroQuest — Agent Operating Rules

You are rebuilding RetroQuest: a gamified (Pokémon-themed) task manager.
Stack target: React/TypeScript frontend, Express backend on Render, Supabase (Postgres +
Auth), Prisma ORM.

This file loads every session. It is short on purpose — task-level detail lives in the
active `phases/PHASE_N.md` file. State lives in `state/STATE.json`, never in your memory
of past sessions. Read both before writing any code.

---

## 0. First action, every session, no exceptions

1. Read `state/STATE.json`. This is the only source of truth for what's done, in
   progress, or blocked. Do not trust anything you "remember" from a prior session's
   conversation — you have no such memory. If a prior session's SESSION_HANDOFF.md was
   pasted into your first message, treat it as a pointer to go verify against STATE.json
   and the actual repo, not as ground truth by itself.
2. Read `PHASE_INDEX.md` to confirm the active phase.
3. Read `phases/PHASE_<active>.md` for the task list.
4. Cross-check STATE.json's claims against reality before continuing: if it says Task 2.2
   is done, actually look at the code / run the gate check for 2.2 again briefly. State
   files can go stale if a session crashed mid-update. Trust but verify your own trail.

---

## 1. The one rule above all others

**Never let two implementations of the same thing exist at once.**

The original RetroQuest codebase failed because it accumulated three parallel backends and
two parallel auth systems that silently drifted apart. If you're about to create a file
that does something an existing file already does — stop. Either you're replacing the old
one (delete it in the same task) or you've misunderstood the task. Ask if unsure.

This is a named, documented failure mode in agentic coding — "agentic entropy" producing
"agentic technical debt" via duplicate (Type-4 clone) implementations that silently
diverge. See `RESEARCH_NOTES.md`. Treat this as a hard constraint, not a style preference.

---

## 2. Working rhythm — Explore, Plan, Implement, Verify

For anything beyond a trivial one-line fix:

1. **Explore first.** Read relevant existing files before writing anything. For
   investigation touching many files, use a subagent so your main context stays clean.
2. **Plan before coding.** The task list in the active phase file has already done most of
   this — follow it, don't reinvent it. If a task is genuinely ambiguous, ask one specific
   question rather than guessing.
3. **Implement against the plan.** Don't scope-creep. If you notice something else broken,
   log it in STATE.json's `notes` array for that phase instead of fixing it mid-task.
4. **Verify before calling it done.** Run the task's gate exactly as specified in the phase
   file's Gate section. Never mark a task done in STATE.json without having actually run
   its checks and captured real output. "Looks right" is not a passed gate.

---

## 3. Never hallucinate — ground every claim

- Never state an endpoint, column, env var, or library behavior exists without having
  actually read it in the current repo or current official docs. Supabase/Prisma/Render
  APIs change; don't rely on training-data memory for exact current behavior — look it up.
- Never claim a test passed, build succeeded, or a request returned X without having
  actually run it and captured the real output in this session.
- If requirements are ambiguous, ask one specific clarifying question. Don't silently pick
  an assumption and build on it.

---

## 4. Structure rules (scalability from day one)

- One route file per resource. No monolithic single-file backend.
- One shared auth middleware. No per-route inline token verification.
- One Prisma client instance, imported everywhere.
- One source of truth per piece of state — no dual-tracked points/levels/etc.
- Server is the source of truth for anything gamification-related. Client-side checks are
  UX hints only, never authority. (The original app let anyone catch any Pokémon via a raw
  API call because only the frontend checked eligibility — do not repeat this.)
- Prefer boring and explicit over clever.

---

## 5. Gate categories (apply the relevant subset per task, as specified in the phase file)

Every task in a phase file states which of these apply to it and exactly what the check
is. Do not invent your own interpretation of a category — use the task's stated checks.

1. **Build/Compile** — typecheck, build, lint clean
2. **Functional correctness** — feature does what the task says, exercised with real
   requests/data, not just read back and assumed correct
3. **Edge cases** — the specific, enumerated edge cases stated in the task (not a generic
   "handle edge cases" — the phase file lists the actual cases to test)
4. **Security/ownership boundaries** — cross-user isolation, server-side authority,
   input validation, auth boundary checks
5. **Data integrity** — atomic operations where required, no dual-source-of-truth drift
6. **Scalability/structure** — no duplicate implementations, correct file organization,
   no obvious N+1 query patterns
7. **Regression** — previous phases' Definition of Done still holds (spot-check, don't
   assume a new phase left old work intact)

---

## 6. Updating state (do this continuously, not just at session end)

After completing (and gating) each task:
- Update `state/STATE.json`: mark the task's status, record which gate categories were
  checked and their result, timestamp it, note any files changed.
- Do this per-task, not batched at the end — if the session is interrupted, the state file
  should still be accurate up to the last completed task.

## 7. Ending a session

When you and the user agree to end the session (or context is getting large and you should
proactively suggest wrapping up):

1. Ensure `state/STATE.json` is fully up to date (see §6).
2. Generate `SESSION_HANDOFF.md` using the exact structure in
   `templates/HANDOFF_TEMPLATE.md`. Fill in every section — don't leave placeholders.
   This file is what the user pastes into the next session's first message.
3. If the active phase's Definition of Done is now fully met, also generate the phase
   summary using `templates/PHASE_SUMMARY_TEMPLATE.md`, save it as
   `phases/PHASE_<N>_SUMMARY.md`, and clearly state to the user: "Phase N is complete —
   here is the pass/fail summary" before ending.
4. Tell the user explicitly: "Copy the contents of SESSION_HANDOFF.md as your first
   message in the next session."

Do not end a session with an out-of-date STATE.json or a missing handoff file — this is
the mechanism that prevents context loss between sessions, so treat it as mandatory, not
optional cleanup.

---

## 8. What NOT to do

- Don't touch `api/index.js`, root `routes/*`, `config/passport.js`, or root
  `middleware/auth.js` — deleted in Phase 0, not migrated.
- Don't reintroduce hand-rolled JWT/bcrypt auth — Supabase Auth is the system now.
- Don't add features outside the active phase's task list, even if related or easy. Log
  them as a note in STATE.json for later instead.
- Don't mark a task done because the UI "looks like it worked."
- Don't skip ahead to a later phase's tasks because they seem quick — phase order matters
  because later phases assume earlier gates actually passed.

---

## 9. Commands

Fill this in as soon as real commands exist (Phase 1 onward) — do not leave an agent to
guess a test/build command, it wastes turns and can run the wrong thing.

- Install (frontend): `npm install`
- Install (backend): `npm install`
- Dev: TBD
- Build: TBD
- Typecheck: TBD
- Test: TBD
- Migrate DB: `npx prisma migrate dev`
- Gate check script: `./scripts/gate_check.sh <phase> <task_id>` (see scripts/README.md)

---

Active phase: see `PHASE_INDEX.md`.
