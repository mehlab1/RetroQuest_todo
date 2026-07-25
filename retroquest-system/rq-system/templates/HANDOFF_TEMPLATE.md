<!--
This is a TEMPLATE. The agent fills this in at end-of-session and saves the filled
version as SESSION_HANDOFF.md at repo root, overwriting the previous one.
The user pastes the CONTENTS of that filled file as their first message in the next
session. Every section must be filled with real specifics — no placeholders left in,
no "various changes were made" vagueness. A section left generic is a handoff that fails
at its one job.
-->

# Session Handoff — RetroQuest

**Generated:** <ISO timestamp>
**Active phase:** <N — name>
**Phase status:** <not_started / in_progress / done_pending_verification / complete>

---

## Read these first, in this order
1. `CLAUDE.md`
2. `state/STATE.json`
3. `PHASE_INDEX.md`
4. `phases/PHASE_<N>.md`

Then continue from "Immediate next step" below. Do not re-derive the plan from scratch —
it already exists in the phase file. Do not re-do gate checks for tasks STATE.json marks
as done unless something looks inconsistent when you spot-check.

---

## What was completed this session
<Bulleted list, one line per task or meaningful sub-step actually finished. Reference
task IDs from the phase file, e.g. "Task 1.2 — Prisma schema for user_profiles: done,
gate passed (see STATE.json 1.2.gate_results)." Not a narrative — a checklist.>

## Current state of the codebase
<Factual, specific: what exists now that didn't before this session began. Which files
were created/modified/deleted. Whether the app currently builds/runs. Any WIP that's
mid-edit and not yet gated.>

## Gate results this session
<For each task worked on: which gate categories were checked (per CLAUDE.md §5) and the
actual result — pass/fail, with the real command output or a summary of it. If something
failed and was left failing, say so explicitly, don't bury it.>

## Immediate next step
<The single specific next action — task ID and what exactly needs to happen. Not "continue
Phase 2" — something like "Task 2.2, sub-task 3: implement DELETE /api/tasks/:id, gate not
yet run.">

## Blockers / open questions for the user
<Anything the previous session couldn't resolve on its own — missing credentials, an
ambiguous requirement, a design decision that needs a human call. If empty, say "None."
Don't omit this section even if empty — an omitted section is ambiguous with "forgot to
check.">

## Known issues / deferred items
<Anything noticed but intentionally not fixed this session (out of scope for the current
task). Should match what's in STATE.json's cross_phase_notes / known_deferred_items —
this is a human-readable mirror of that, not a separate list to maintain.>

## Anything unusual this session
<Environment issues, a gate that had to be checked manually because a tool wasn't
available, a deviation from the phase file's plan and why. Empty is fine — "None" is a
valid, complete answer here too.>
