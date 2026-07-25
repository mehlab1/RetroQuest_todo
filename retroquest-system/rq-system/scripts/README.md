# scripts/

## gate_check.sh

Run: `./scripts/gate_check.sh <phase> <task_id>`

Automates the checkable subset of a task's gate (build, typecheck, lint, and a couple of
structural anti-duplication smell tests). It is intentionally not exhaustive — see the
comment block at the top of the script.

**This script must grow with the project.** As soon as Phase 1 produces a real
`backend/package.json` with real scripts, and as soon as Phase 2 produces real API routes,
extend this script to add:
- Real `curl`-based functional checks for each endpoint (happy path + the specific edge
  cases listed in that task's Gate section)
- Cross-user isolation checks (create two test users, confirm user A can't touch user B's
  data) — this can and should be scripted, not just manually eyeballed once
- Any repeatable data-integrity check (e.g., a script that fires N concurrent requests at
  a points-mutation endpoint and checks the final value is exactly what's expected, to
  catch the exact race-condition class of bug found in the original app's
  `updateUserPoints` function)

The agent working in Claude Code should treat "extend gate_check.sh for this phase" as
part of that phase's own task list where it makes sense — don't leave automatable checks
permanently manual just because the script wasn't extended yet.

## Why a script instead of just trusting the agent's say-so

This is the mechanical enforcement half of the verification gates described in
CLAUDE.md §5 and RESEARCH_NOTES.md's "trust-then-verify gap" section. An agent asserting
"the build passes" and an agent that just ran `npm run build` and is looking at real
output are not the same reliability level — the script exists so there's always a
real, re-runnable command producing the evidence, not a claim.
