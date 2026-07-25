# Research Notes — Why This System Is Shaped This Way

Reference document, not loaded by the agent during normal work. Compiled July 2026 from
Anthropic's official docs, Reddit/GitHub community practice, and arXiv/peer-reviewed
research on agentic coding failure modes. Read this if you want to audit *why* the rules
in CLAUDE.md and the phase files say what they say, rather than take it on faith.

## 1. Context Rot — why sessions must be scoped, and why state lives in a file, not memory

Chroma Research, "Context Rot: How Increasing Input Tokens Impacts LLM Performance"
(Hong, Troynikov, Huber, July 2025). Tested 18 frontier models including Claude 4,
GPT-4.1, Gemini 2.5, Qwen3. Finding: model reliability degrades measurably and
non-uniformly as input length grows, even on simple retrieval tasks, well before the
context window is full. Mechanisms: "lost-in-the-middle" attention bias (corroborated
independently by Liu et al., Stanford/TACL 2024, showing 30%+ accuracy drops on
mid-context information), attention dilution, and distractor interference.

Anthropic's own official Claude Code docs (code.claude.com/docs/en/best-practices)
build their entire guidance structure around this constraint directly.

**Applied here as:** the whole reason `state/STATE.json` exists as an external,
machine-readable file rather than relying on conversational memory across sessions.
A new session literally cannot have context rot from a previous session because it starts
clean and reads only the current, compact state — this is the actual mechanism behind
"no context lost between sessions," not a promise about memory that doesn't exist.

## 2. The "trust-then-verify gap" — why every task needs a real, evidenced gate

Anthropic's official docs name this exact failure mode directly: *"Claude produces a
plausible-looking implementation that doesn't handle edge cases... If you can't verify
it, don't ship it."*

This matches what the original RetroQuest codebase actually had: UI that looked complete
while `/api/pokemon/catch` had zero server-side eligibility checks, `/api/users/profile`
didn't exist in the live deployment despite frontend code calling it, and points tracking
had an unguarded read-modify-write race condition — all things that looked done in
isolated review but failed under real verification.

**Applied here as:** the seven-category gate system (CLAUDE.md §5), every phase task
ending in explicit checks requiring pasted real output, and `scripts/gate_check.sh`
existing specifically so "the build passes" means a command was actually run, not
asserted.

## 3. Agentic entropy and duplicate implementations — the root cause of the original mess

- "Beyond the 'Diff': Addressing Agentic Entropy in Agentic Software Development" (arXiv
  2604.16323, 2026): formally defines **agentic entropy** — autonomous agent edits
  drifting from architectural intent over successive high-velocity, context-limited
  actions — and **agentic technical debt** as its accumulated outcome.
- "More Code, Less Reuse: Investigating Code Quality and Reviewer Sentiment towards
  AI-generated Pull Requests" (arXiv 2601.21276): empirically found agents systematically
  introduce **Type-4 clones** (semantically duplicate, syntactically divergent code),
  creating silent technical debt — a bug fixed in one copy, missed in the duplicate,
  because reviewers rate these PRs neutrally-to-positively and the debt goes unnoticed.
- Addy Osmani, "Comprehension Debt" (2026): the human-side effect — a codebase that
  "looks clean" while the gap between code volume and genuine human understanding widens.

This is a near-exact description of RetroQuest pre-audit: three parallel backends, two
parallel auth systems, a `users.points`/`gamification.points` split that silently drifted
whenever a quest bonus was awarded to one table but not the other.

**Applied here as:** CLAUDE.md §1 (the one rule above all others), Phase 0 being pure
deletion before new code, explicit "replace, don't migrate" instructions for auth, and
`gate_check.sh`'s automated duplicate-PrismaClient / orphaned-legacy-file smell tests.

## 4. Explore → Plan → Implement → Verify, with adversarial review in a separate context

Anthropic's docs formalize this exact four-phase loop and specifically recommend a
fresh-context subagent review a diff against the written plan before calling work done —
deliberately not the same context that wrote the code. Quote: *"A reviewer prompted to
find gaps will usually report some, even when the work is sound... Tell the reviewer to
flag only gaps that affect correctness or the stated requirements."*

**Applied here as:** CLAUDE.md §2 (working rhythm), and the recommendation to
periodically run a fresh Claude Code session/subagent to review a diff against the
relevant phase file before considering a task truly done, rather than trusting the
implementing session's own self-assessment.

## 5. Community-validated tactics folded in

From DEV.to ("9 Pro Tips to Truly Tame Claude for Coding," Dec 2025), cross-referenced
against Anthropic's own docs where they overlap:
- **TDD-first for logic with financial-equivalent stakes** (points/levels, once Phase 3
  exists) — write test cases before implementation. Matches Anthropic's own "provide
  verification criteria" guidance.
- **"State of the union" session handoffs** — this is the direct ancestor of this
  system's `SESSION_HANDOFF.md` mechanism, formalized into a strict template
  (`templates/HANDOFF_TEMPLATE.md`) rather than left as a loose end-of-session summary,
  specifically so nothing gets vaguely described or omitted.
- **CLAUDE.md must stay short.** Direct Anthropic quote: *"Bloated CLAUDE.md files cause
  Claude to ignore your actual instructions!"* This is why the durable file here is dense
  and short, and all task-level/edge-case detail lives in per-phase files loaded only
  when that phase is active.

## Caveats, stated honestly

- The Chroma study is widely cited and methodologically solid, but Chroma has a
  commercial interest in RAG/retrieval remaining relevant — worth noting as a mild
  framing bias, though the core empirical finding (degradation exists, is measurable) is
  corroborated independently by the Stanford/TACL lost-in-the-middle work.
- "Agentic entropy" and "comprehension debt" are recent (2026) framings — precisely
  descriptive of what happened here, but not yet as heavily cross-validated as older,
  more established software-engineering literature on technical debt generally.
- **This system is a strong scaffold, not a guarantee.** A gate is only as good as
  whether it was actually run — the system is designed to make skipping that hard (by
  requiring pasted evidence, by having a script produce real output), but it still
  depends on the operating agent actually following CLAUDE.md rather than summarizing
  past it. If you (the user) ever see a task marked "done" in STATE.json without
  corresponding gate evidence, that's a signal the system isn't being followed correctly
  in that session — worth calling out immediately rather than letting it compound.
