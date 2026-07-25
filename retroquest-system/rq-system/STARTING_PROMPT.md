I'm rebuilding RetroQuest using the operating system in this repo. Before doing anything
else:

1. Read `CLAUDE.md` in full.
2. Read `state/STATE.json` in full.
3. Read `PHASE_INDEX.md` in full.
4. Read `phases/PHASE_0.md` in full (this is the active phase per STATE.json).
5. Read `RESEARCH_NOTES.md` if you want the reasoning behind the rules — not required
   every session, but read it now, once, so you understand why the rules exist.

Then confirm back to me, briefly:
- Your understanding of the one rule above all others (CLAUDE.md §1)
- The first task you're about to start (should be Task 0.1)
- Anything you need from me before starting (credentials, access, clarifications)

Do not write any code yet. Confirm understanding first, then wait for my go-ahead.

From here forward: follow CLAUDE.md exactly, work through phases/PHASE_0.md task by
task, update state/STATE.json after each completed task with real gate evidence (not
assertions), and when we're ready to end this session, generate SESSION_HANDOFF.md per
CLAUDE.md §7 so I can start a clean next session with zero context loss.
