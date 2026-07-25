# Phase 0 — Task 0.4 Findings: Prisma Schema Cruft Audit

## Notable discovery: two divergent `schema.prisma` files exist

`prisma/schema.prisma` (root) and `backend/prisma/schema.prisma` are **not the same file** —
they've drifted (Type-4 clone, exactly the failure mode CLAUDE.md §1 exists to prevent):
different naming conventions for the same tables (`CatchablePokemon`/`@@map` vs raw
`catchable_pokemon`), and a documented live bug where root's `model pokemon_gifs` (lowercase,
no `@@map`) didn't match the `prisma.pokemonGif.*` calls in the now-deleted `api/index.js`
(caught previously by an auto-generated audit in `codebase-context/AUDIT_REPORT.md`).

**Not resolved in this task** — reconciling two schemas into one is schema *redesign*, out of
scope for Task 0.4 ("do NOT redesign schema structure meant to survive into Phase 1"). Logged
as a `known_deferred_item` for Phase 1, which owns "Foundation — Supabase + skeleton backend"
and will define the single canonical schema per CLAUDE.md §4 ("One Prisma client instance,
imported everywhere").

## Audit method

Read `prisma/schema.prisma` fully. For every model, grepped the whole repo (excluding
`node_modules`) for `prisma.<modelName>` usage to determine which surviving (non-deleted)
files still reference it.

## Models/fields checked

| Model | Still referenced by surviving code? | Verdict |
|---|---|---|
| `User` | Yes — core to every future phase | Keep |
| `PokemonPet` | Yes — `prisma/seed.js`, `check-db.js` | Keep |
| `CatchablePokemon` | Yes — `prisma/seed.js`, `check-db.js` | Keep |
| `Task` | Deleted routes only, but core to Phase 2 (task CRUD) | Keep — survives into Phase 1/2 |
| `TaskHistory` | Deleted routes only, but core to Phase 5 (history) | Keep — survives |
| `Gamification` | Deleted routes only, but core to Phase 3 | Keep — survives |
| `DailyQuest` | Deleted routes only, but core to Phase 5 (quests) | Keep — survives |
| `UserCaughtPokemon` | Deleted routes only, but core to Phase 4 (Pokémon) | Keep — survives |
| `model pokemon_gifs` (root schema only, lowercase, no `@@map`) | **No.** Its only intended consumer was `api/index.js` (deleted in Task 0.2), and the call there (`prisma.pokemonGif.*`) never actually matched this lowercase model anyway (pre-existing bug). `backend/prisma/schema.prisma` already has a correct, actively-used equivalent (`model PokemonGif`, `@@map("pokemon_gifs")`), consumed by 4 surviving `backend/*.js` scripts (`add-more-pokemon.js`, `populate-pokemon-db.js`, `populate-real-sprites.js`, `verify-pokemon-db.js`). | **Removed from root schema only** |

`User.password` / `User.googleId` fields exist only to support the now-deleted
Passport local/Google OAuth strategies. Left untouched: Phase 1 (Supabase Auth) is very
likely to redesign how the `User`/profile table relates to auth, and Task 0.4 explicitly
says not to redesign schema meant to be touched by Phase 1 — removing these now would be
guessing at Phase 1's design rather than clearing genuine dead cruft. Logged as a
`known_deferred_item`.

## Gate evidence

- `npx prisma validate` (with a placeholder `DATABASE_URL`, since no real one is configured
  in this environment — pre-existing, unrelated to this change): schema is valid after
  removing `model pokemon_gifs`.
- `backend/prisma/schema.prisma` was **not modified** — its working `PokemonGif` model and
  its 4 live consumers are untouched.

## Removed

- `model pokemon_gifs` — root `prisma/schema.prisma` only, 7 lines. Dead: only consumer
  (`api/index.js`) deleted in Task 0.2, zero surviving references, and a correctly-modeled,
  actively-used duplicate already exists in `backend/prisma/schema.prisma`.
