# Phase 0 — Task 0.1 Findings: Confirm What's Actually Live

## Live deploy entry point

`vercel.json` builds two things: the Vite static frontend (`package.json` → `dist`) and
`api/index.js` as a `@vercel/node` serverless function. All `/api/*` requests rewrite to
`api/index.js`. **`api/index.js` is the only live backend entry point.**

`.vercelignore` explicitly excludes `backend/` from the deployment bundle, with the comment
"Backend (we only need the API folder)". This independently confirms `backend/` is not part
of the live Vercel deployment, regardless of what it imports internally.

`api/index.js` is a self-contained monolith — it imports only `express`, `cors`, `bcryptjs`,
`jsonwebtoken`, `express-rate-limit`, `express-validator`, `@prisma/client`, `node-cron`, and
`../services/taskArchiver.js`. It does not import anything from root `routes/`,
`middleware/`, or `config/`, and does not use `passport` despite `passport` being a root
`package.json` dependency.

## Orphan confirmation — deletion candidates (Task 0.2)

Method: grepped the whole repo (excluding `node_modules`) for static imports/requires,
dynamic `import()`, and checked both root and `backend/package.json` `scripts` blocks.

| File(s) | Only imported by | Verdict |
|---|---|---|
| `api/index.js.backup` | Nobody. Only appears in `codebase-context/MANIFEST.json`, an auto-generated file listing (not a code reference). | **Orphaned** |
| root `routes/*.js` (auth, gamification, history, pokemon, quests, tasks, users) + `tasks.js.snippet` | Each other and root `middleware/auth.js` only — a self-contained dead cluster with zero importers from `api/index.js` or `src/`. | **Orphaned** |
| root `middleware/auth.js` | Root `routes/*.js` only (same dead cluster). | **Orphaned** |
| root `config/passport.js` | Nobody — zero importers found anywhere, not even from root `routes/*.js`. | **Orphaned** |
| `backend/config/passport.js` | `backend/server.js` only. | **Orphaned** (backend/ excluded from deploy per `.vercelignore`; server.js itself is being gutted, not deployed) |
| `backend/middleware/auth.js` | `backend/routes/*.js` only. | **Orphaned** |
| `backend/routes/*.js` | `backend/server.js` only. | **Orphaned** |

No `package.json` script (root or `backend/`) invokes any of the above files directly —
`backend:dev` etc. run `backend/server.js`, which is being kept only as an Express-setup
skeleton per `phases/PHASE_0.md`, not deleted outright.

## Orphan confirmation — frontend candidates (Task 0.3)

Checked `src/` for import statements (both `components/X` and relative `./X` forms) and for
any reference in `*.test.*`/`*.spec.*` files. No Storybook config exists in the repo.

| File | Import statements found | Test-file references | Verdict |
|---|---|---|---|
| `src/components/ErrorBoundary.tsx` | 0 | 0 | **Orphaned** |
| `src/components/Header.tsx` | 0 | 0 | **Orphaned** |
| `src/components/MusicToggle.tsx` | 0 | 0 | **Orphaned** |
| `src/components/SoundToggle.tsx` | 0 | 0 | **Orphaned** |
| `src/components/PokemonSprite.tsx` | 0 | 0 | **Orphaned** |

Note: a plain-text grep for these names also matches `src/components/AudioControls.tsx`
(it defines a local `handleMusicToggle` handler function) — confirmed by inspection this is
a same-named local variable, not an import of `MusicToggle.tsx`. `AudioControls.tsx`
appears to be the component that superseded `MusicToggle`/`SoundToggle`.

## Edge cases checked

- **Dynamic imports**: grepped for `import(...)` and `require(...)` patterns referencing
  `routes|middleware|config|api/index` anywhere in the repo — zero matches beyond the
  static imports already accounted for above.
- **package.json scripts**: read both root and `backend/package.json` `scripts` blocks in
  full — no script references any deletion candidate directly.

## Conclusion

All files listed in `phases/PHASE_0.md` Task 0.2 and Task 0.3 are confirmed orphaned
relative to the live Vercel deployment (`api/index.js` + Vite frontend). Safe to proceed to
Task 0.2/0.3 deletion.
