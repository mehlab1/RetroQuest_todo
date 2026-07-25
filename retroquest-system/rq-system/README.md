# RetroQuest Rebuild — Operating System for Claude Code

This folder is a self-contained operating system for rebuilding RetroQuest with Claude
Code, designed so that:
- Every task has explicit, research-backed edge cases and a real (evidenced, not
  asserted) verification gate
- Progress is tracked in a machine-readable state file, not in anyone's memory
- Starting a new session (to avoid context degradation) loses zero information, because
  the previous session generates the next session's exact starting prompt
- You can ask "did phase N pass?" at any point and get an honest, evidenced answer

## Setup (one-time)

1. Unzip this into the root of your RetroQuest repo (or wherever you're starting the
   rebuild — CLAUDE.md and STATE.json assume repo-root placement).
2. Confirm the folder structure sits at repo root:
   ```
   CLAUDE.md
   PHASE_INDEX.md
   RESEARCH_NOTES.md
   README.md              (this file)
   phases/
     PHASE_0.md
     PHASE_1.md
     PHASE_2.md
   state/
     STATE.json
   templates/
     HANDOFF_TEMPLATE.md
     PHASE_SUMMARY_TEMPLATE.md
   scripts/
     gate_check.sh
     README.md
   ```
3. Open Claude Code in this repo.
4. Paste the contents of `STARTING_PROMPT.md` as your very first message.

## How sessions work from here on

- Work happens; the agent updates `state/STATE.json` after each completed task (not just
  at the end).
- When you're ready to end a session (or the agent proactively suggests it due to context
  size), it generates `SESSION_HANDOFF.md` at repo root.
- To start the next session: open a new Claude Code session, paste the full contents of
  `SESSION_HANDOFF.md` as your first message. That's it — the new session reads
  CLAUDE.md, STATE.json, and the handoff, and picks up exactly where the last one left
  off.
- When a phase's Definition of Done is fully met, the agent generates
  `phases/PHASE_N_SUMMARY.md` — a pass/fail report with real evidence, following
  `templates/PHASE_SUMMARY_TEMPLATE.md`. Read this before agreeing to move to the next
  phase.

## Asking "did it pass?"

At any point, you can just ask the current or a fresh session: *"Read state/STATE.json
and phases/PHASE_<N>.md and tell me honestly whether Phase N's Definition of Done is
actually met, with evidence for each item."* This works because the state file is
structured specifically to make that question answerable without re-litigating the whole
history.

## When phases 3–5 are needed

Phases 3 (gamification core), 4 (Pokémon system), and 5 (quests/history/remaining
features) aren't written yet — deliberately, since their exact shape should reflect what
Phase 0–2 actually produced, not a speculative guess made before any of this exists. When
you're ready, ask for "Phase 3 written in the same style as Phase 0–2, informed by
RESEARCH_NOTES.md and the current STATE.json" and it'll be built the same way: numbered
tasks, explicit gate categories, enumerated edge cases, Definition of Done.

## If something feels off

If STATE.json ever claims a task is done without gate evidence you can see, or a
handoff feels vague instead of specific — that's the system not being followed correctly,
not a fundamental limitation. Say so directly; CLAUDE.md §0 and §7 exist specifically to
prevent this, so flagging it lets it get corrected rather than silently compounding.

See `RESEARCH_NOTES.md` for the evidence behind why this system is built this way.
