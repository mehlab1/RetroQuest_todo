<!--
Filled in and saved as phases/PHASE_<N>_SUMMARY.md the moment a phase's Definition of
Done is fully met (or if the user asks "did phase N pass?" at any point — fill in
honestly based on current STATE.json, including partial/failed status if that's the
truth).
-->

# Phase <N> Summary — <name>

**Overall status:** <PASSED / PASSED WITH DEFERRED ITEMS / IN PROGRESS / FAILED — blocked>

## Definition of Done — checklist
<Copy the exact Definition of Done list from the phase file. Mark each item ✅ / ❌ / ⏳
with a one-line reason. This must correspond exactly to STATE.json — no item marked ✅
here without a passing gate result recorded in STATE.json.>

## Task-by-task results

| Task | Description | Status | Gate categories checked | Result |
|---|---|---|---|---|
| N.1 | <short desc> | done/pending/blocked | build, functional, security | pass/fail details |
| ... | | | | |

## What was actually verified (evidence, not assertion)
<For each major gate: what command/request was run and what it returned. This is the
section that lets the user trust "passed" means something, not just that the agent said
so. Paste real output or a faithful summary of it.>

## Deferred / known issues carried forward
<Anything noted during this phase that wasn't in scope to fix now. These should also
appear in STATE.json's known_deferred_items so they aren't lost when we reach the phase
where they're relevant.>

## Regression check against prior phases
<Explicit confirmation that previous phases' Definition of Done items were spot-checked
and still hold, or a note of what broke and needs attention before proceeding.>

## Recommendation
<One of: "Ready to proceed to Phase <N+1>." / "Not ready — see blockers above." /
"Ready to proceed, but the following deferred items should be prioritized soon: ...">
