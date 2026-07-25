#!/usr/bin/env bash
# Gate check runner for RetroQuest rebuild.
#
# Usage: ./scripts/gate_check.sh <phase> <task_id>
# Example: ./scripts/gate_check.sh 2 2.2
#
# WHAT THIS SCRIPT IS: a growing set of automated checks. Early phases (0, 1) have
# little to automate — there's no app yet to build/test. As real code exists (Phase 2
# onward), add real checks below instead of leaving this as a stub. The agent working
# in Claude Code should EXTEND this script as part of each phase's setup, not just run
# whatever's here today and call the rest "manually verified" forever.
#
# WHAT THIS SCRIPT IS NOT: a replacement for the task-specific edge case checks listed
# in each phase file. Those often require actual requests with actual auth tokens,
# cross-user test accounts, etc. — this script handles the automatable subset (build,
# typecheck, lint, and any scripted test/curl checks you add). Task-specific manual
# checks still need to be run and their output pasted into STATE.json / the handoff,
# per CLAUDE.md.

set -euo pipefail

PHASE="${1:-}"
TASK="${2:-}"

if [[ -z "$PHASE" || -z "$TASK" ]]; then
  echo "Usage: $0 <phase> <task_id>"
  exit 2
fi

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

PASS=0
FAIL=0

check() {
  local name="$1"
  local cmd="$2"
  echo "--- CHECK: $name ---"
  if eval "$cmd"; then
    echo "PASS: $name"
    PASS=$((PASS+1))
  else
    echo "FAIL: $name"
    FAIL=$((FAIL+1))
  fi
  echo ""
}

echo "=== Gate check: Phase $PHASE, Task $TASK ==="
echo ""

# --- Category 1: Build/Compile ---
# Extend these once package.json scripts exist. Left conditional so this script
# doesn't hard-fail during Phase 0 when there may be nothing to build yet.
if [[ -f "backend/package.json" ]]; then
  if grep -q '"build"' backend/package.json 2>/dev/null; then
    check "backend build" "cd backend && npm run build && cd .."
  fi
  if grep -q '"typecheck"' backend/package.json 2>/dev/null; then
    check "backend typecheck" "cd backend && npm run typecheck && cd .."
  fi
  if grep -q '"lint"' backend/package.json 2>/dev/null; then
    check "backend lint" "cd backend && npm run lint && cd .."
  fi
fi

if [[ -f "package.json" ]] && grep -q '"build"' package.json 2>/dev/null; then
  check "frontend build" "npm run build"
fi
if [[ -f "package.json" ]] && grep -q '"typecheck"' package.json 2>/dev/null; then
  check "frontend typecheck" "npm run typecheck"
fi
if [[ -f "package.json" ]] && grep -q '"lint"' package.json 2>/dev/null; then
  check "frontend lint" "npm run lint"
fi

# --- Category 6: Scalability/structure — automatable subset ---
# Anti-duplication check: flag if more than one file defines an Express app entrypoint
# pattern, more than one PrismaClient instantiation site, etc. Cheap grep-based smell
# tests, not exhaustive — a real review still matters, but this catches the exact
# failure mode that broke the original app (parallel implementations).
echo "--- CHECK: no duplicate PrismaClient instantiation ---"
PRISMA_NEW_COUNT=$(grep -rl "new PrismaClient(" --include="*.js" --include="*.ts" . 2>/dev/null | grep -v node_modules | wc -l | tr -d ' ')
if [[ "$PRISMA_NEW_COUNT" -le 1 ]]; then
  echo "PASS: found $PRISMA_NEW_COUNT site(s) instantiating PrismaClient (expect exactly 1, or 0 if not yet scaffolded)"
  PASS=$((PASS+1))
else
  echo "FAIL: found $PRISMA_NEW_COUNT sites instantiating PrismaClient — should be exactly 1 shared instance. Files:"
  grep -rl "new PrismaClient(" --include="*.js" --include="*.ts" . 2>/dev/null | grep -v node_modules
  FAIL=$((FAIL+1))
fi
echo ""

echo "--- CHECK: no orphaned legacy backend files ---"
LEGACY_FOUND=0
for f in "api/index.js" "config/passport.js" "middleware/auth.js"; do
  if [[ -f "$f" ]]; then
    echo "FOUND (should be deleted per Phase 0): $f"
    LEGACY_FOUND=1
  fi
done
if [[ "$LEGACY_FOUND" -eq 0 ]]; then
  echo "PASS: no legacy files found"
  PASS=$((PASS+1))
else
  echo "FAIL: legacy files still present"
  FAIL=$((FAIL+1))
fi
echo ""

# --- Summary ---
echo "=== Summary: $PASS passed, $FAIL failed (automated checks only) ==="
echo ""
echo "REMINDER: this covers only the automatable subset. Check phases/PHASE_${PHASE}.md"
echo "for this task's full Gate section — functional correctness, edge cases, and"
echo "security/ownership checks generally require real requests against a running app"
echo "and must be run and recorded manually (or via a task-specific script you add here)."

if [[ "$FAIL" -gt 0 ]]; then
  exit 1
fi
exit 0
