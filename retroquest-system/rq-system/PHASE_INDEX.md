# Phase Index

Read this every session, right after `state/STATE.json`. This file tells you the overall
shape of the rebuild; STATE.json tells you exactly where things actually stand.

| Phase | Name | File | Summary (once complete) |
|---|---|---|---|
| 0 | Clear the ground | `phases/PHASE_0.md` | `phases/PHASE_0_SUMMARY.md` |
| 1 | Foundation — Supabase + skeleton backend | `phases/PHASE_1.md` | `phases/PHASE_1_SUMMARY.md` |
| 2 | Literal basics — auth + task CRUD, seamless | `phases/PHASE_2.md` | `phases/PHASE_2_SUMMARY.md` |
| 3 | Gamification core (points/levels/streaks) | not yet written | — |
| 4 | Pokémon system | not yet written | — |
| 5 | Quests, history, remaining features | not yet written | — |

**The current phase number is authoritative in `state/STATE.json`'s `active_phase` field,
not in this table** — this table is a map, STATE.json is the GPS. If they ever disagree,
STATE.json wins, and that disagreement itself is worth flagging to the user as something
odd that happened.

## Rules

1. Work through phases in order. Do not start a phase's tasks while the previous phase's
   Definition of Done is unmet in STATE.json.
2. Each phase file ends with a Definition of Done checklist. It must be fully met, with
   gate evidence recorded in STATE.json, before advancing `active_phase`.
3. When a phase completes, generate its `PHASE_N_SUMMARY.md` (using
   `templates/PHASE_SUMMARY_TEMPLATE.md`) before telling the user it's done, and before
   advancing `active_phase` in STATE.json.
4. Phases 3–5 are deliberately not written yet — each gets written, in this same style,
   once we reach it and know what Phase 0–2 actually produced. Do not pre-write them
   speculatively; ask the user to request that phase's file when it's time.

## For the coding agent, every session, in order

1. `CLAUDE.md`
2. `state/STATE.json`
3. This file
4. `phases/PHASE_<active_phase>.md`
5. If `state/STATE.json` mentions a prior `SESSION_HANDOFF.md`, cross-check it against
   STATE.json and the repo rather than trusting it blindly — see CLAUDE.md §0.
