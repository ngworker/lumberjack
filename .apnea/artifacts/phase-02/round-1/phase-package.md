---
status: done
---

# Phase package — Phase 2: E2E and docs apps green on the new stack

Source: approved plan `.apnea/artifacts/plan.md` (Phase 2 only). Phase 1 is merged (commit `2b4a31c`): workspace is on Nx 23.1.0 / Angular 22.0.7 / TypeScript 6.0.3 / Cypress 15.18.1 / ESLint 9 flat config, and lint/test/build are green.

## Intent

Prove the migrated library works end-to-end: both Cypress e2e suites pass and the Docusaurus docs app still builds. Fix only the fallout that blocks those runs. This phase makes **no changes unless something fails** — a clean run with zero edits is a valid outcome.

## Context you need

- The `e2e` target is **inferred** by the `@nx/cypress` plugin (see `nx.json` plugins: `targetName: "e2e"`, `ciTargetName: "e2e-ci"`). Root script `pnpm run e2e` = `nx run-many --target=e2e --parallel=1`.
- Two e2e projects:
  - `examples-lumberjack-app-e2e` (`e2e/examples/lumberjack-app-e2e`) — boots `examples-lumberjack-app:serve:development` (Angular dev server, `http://localhost:4200`).
  - `docs-lumberjack-docs-app-e2e` (`e2e/docs/lumberjack-docs-app-e2e`) — boots `docs-lumberjack-docs-app:serve:development` (Docusaurus, `http://localhost:3000`).
- Both cypress configs use `nxE2EPreset(...)` with `webServerCommands` and set `injectDocumentDomain: true` (Cypress 15 migration shim — leave it).
- The docs app (`packages/docs/lumberjack-docs-app/project.json`) has `serve` and `start` targets **without configurations**. Its e2e config's `webServerCommands.default` references `serve:development`. If the docs e2e fails at web-server boot with an "unknown configuration" error, that mismatch is the cause — see contingencies.

## Exact steps

1. **Ensure the Cypress binary is installed** (it is versioned separately from the npm package):

   ```sh
   pnpm exec cypress install
   pnpm exec cypress verify
   ```

2. **Run both e2e suites** (serial on purpose — the apps bind fixed ports):

   ```sh
   pnpm run e2e
   ```

3. **If a suite fails**, isolate it and re-run just that project while debugging:

   ```sh
   pnpm exec nx run examples-lumberjack-app-e2e:e2e
   pnpm exec nx run docs-lumberjack-docs-app-e2e:e2e
   ```

   Fix causes in this order of likelihood:
   - **Web server never becomes ready**: run the serve command from the cypress config directly (e.g. `pnpm exec nx run examples-lumberjack-app:serve:development`) and fix the app/server error you see. For the docs app, `pnpm exec nx run docs-lumberjack-docs-app:serve:development` may fail because the `serve`/`start` targets have no `development` configuration — if so, change `e2e/docs/lumberjack-docs-app-e2e/cypress.config.ts` `webServerCommands` to reference the target that actually exists (`nx run docs-lumberjack-docs-app:start`). Do not restructure the docs app's targets.
   - **Runtime behavior changes from Angular 22** in the example app (e.g. change-detection timing after the `ChangeDetectionStrategy.Eager` migration): prefer fixing the app/spec minimally; do not change library code unless the e2e exposes a genuine library regression — if it does, make the minimal library fix and flag it prominently in your report.
   - **Cypress 15 config/API changes**: adjust `cypress.config.ts` / specs per the error message; keep `nxE2EPreset` usage.
   - **Port already in use**: kill stray dev servers (`lsof -ti:4200,3000 | xargs kill`), re-run.

4. **Re-verify the docs production build** (already green in Phase 1; re-run to prove no Phase 2 edit broke it):

   ```sh
   pnpm exec nx build docs-lumberjack-docs-app
   ```

5. **If you edited anything**, re-run the Phase 1 green checks to prove no regression:

   ```sh
   pnpm run lint
   pnpm run test
   pnpm run build
   pnpm exec nx format:write
   ```

## Files you may touch

- `e2e/examples/lumberjack-app-e2e/**` and `e2e/docs/lumberjack-docs-app-e2e/**` (cypress configs, specs, tsconfig)
- `packages/examples/lumberjack-app/**` (app code/config, only to fix e2e failures)
- `packages/docs/lumberjack-docs-app/**` (config only — no docs content changes)
- Library code under `packages/ngworker/lumberjack/**` **only** for a genuine regression exposed by e2e, minimally, and prominently flagged

## Files you must NOT touch

- `packages/ngworker/lumberjack/package.json` (peers stay `^21.0.0` — Phase 3)
- Root `package.json` dependency versions (no new upgrades in this phase)
- `.github/workflows/**` (Phase 4)
- `.apnea/**`, `.apnea/state.json` — also: `nx format:check` may currently flag harness-written files under `.apnea/tasks/`; that is a known orchestrator-level issue from the Phase 1 review, **not yours to fix and not a phase failure**
- `dist/`, `coverage/`, `tmp/`

## Acceptance checks

1. `pnpm run e2e` exits 0 — both `examples-lumberjack-app-e2e` and `docs-lumberjack-docs-app-e2e` pass.
2. `pnpm exec nx build docs-lumberjack-docs-app` exits 0.
3. If any file was edited: `pnpm run lint`, `pnpm run test`, `pnpm run build` still exit 0.
4. No dependency-version changes in `package.json` / `pnpm-lock.yaml`.

## Verify commands (run all, in this order, from repo root)

```sh
pnpm run e2e
pnpm exec nx build docs-lumberjack-docs-app
pnpm run lint
pnpm run test
pnpm run build
```

All must exit 0. (Cypress caches make re-runs cheap; lint/test/build will be near-instant cache hits if nothing changed.)

## Non-goals (do not do these)

- New e2e coverage or new specs; docs content changes.
- Dependency upgrades of any kind (including Cypress) — Phase 1 fixed the versions.
- Peer-dependency bump, README/compatibility docs (Phase 3).
- CI workflow edits, `nx release`, publishing, tagging (Phase 4).
- Restoring the ESLint plugins dropped in Phase 1 (`eslint-plugin-rxjs`, `-etc`, `-ordered-imports`) — separate follow-up, out of this run.
- Committing or pushing (the run harness handles VCS).
