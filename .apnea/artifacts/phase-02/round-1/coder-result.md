---
status: done
---

# Coder result — Phase 2: E2E and docs apps green on the new stack

## What changed

**Nothing.** Clean run: both Cypress e2e suites and the docs production build passed on the Phase 1 stack with zero source/config edits. Per the phase package, that is a valid outcome.

Steps executed:

1. `pnpm exec cypress install` + `pnpm exec cypress verify` — installed Cypress binary 15.18.1 and verified it.
2. `pnpm run e2e` — both suites passed (see transcript).
3. `pnpm exec nx build docs-lumberjack-docs-app` — green (cache hit).
4. Phase 1 green checks re-confirmed (cache hits; no Phase 2 edits to regress).

## Files touched

None.

## Verify transcript

### 1. `pnpm run e2e` — exit 0

```
NX   Running target e2e for 2 projects and 3 tasks they depend on:
- docs-lumberjack-docs-app-e2e
- examples-lumberjack-app-e2e

# docs-lumberjack-docs-app-e2e
Serving "build" directory at: http://localhost:3000/lumberjack/
  Home page
    ✓ displays a title (153ms)
    ✓ links to the documentation (174ms)
  2 passing (359ms)
  All specs passed!

# examples-lumberjack-app-e2e (reused serve on :4200)
  lumberjack-app
    ✓ Smoke test: It displays a title (294ms)
  Console log driver
    ✓ logs a greeting info message (186ms)
    ✓ logs a critical forest fire message after 2 seconds (77ms)
  3 passing
  All specs passed!

NX   Successfully ran target e2e for 2 projects and 3 tasks they depend on
Run duration: 22.9s
```

Note: after docs e2e finished, Nx logged `Warning: command "docusaurus serve" exited with non-zero status code` while tearing down the web server. The suite itself reported 2/2 passing and the overall `e2e` target exited 0 — not treated as a failure.

### 2. `pnpm exec nx build docs-lumberjack-docs-app` — exit 0

```
NX   Successfully ran target build for project docs-lumberjack-docs-app
Cache: 1/1 hit (100%)
Run duration: 55ms
```

### 3. `pnpm run lint` — exit 0

```
NX   Successfully ran target lint for 7 projects
Cache: 7/7 hit (100%)
Run duration: 74ms
```

### 4. `pnpm run test` — exit 0

```
NX   Successfully ran target test for 4 projects
Cache: 4/4 hit (100%)
Run duration: 50ms
```

### 5. `pnpm run build` — exit 0

```
NX   Successfully ran target build for 3 projects and 1 task they depend on
Cache: 4/4 hit (100%)
Run duration: 119ms
```

## Residual risks

1. **Docs e2e web-server teardown non-zero exit** — `docusaurus serve` sometimes exits non-zero when Cypress/Nx shuts it down after a green suite. Specs pass; overall target exits 0. If CI ever treats child-process teardown as failure, switch docs e2e `webServerCommands` to `docs-lumberjack-docs-app:start` (contingency already documented in the phase package) or ignore the teardown signal.
2. **Docs e2e serves the production build** via `docusaurus serve` (not a live `docusaurus start` dev server). That means docs e2e only exercises the last built static output; a stale `packages/docs/lumberjack-docs-app/build` would still pass until rebuild. Phase 1 left a green build in place; this run re-confirmed `docs-lumberjack-docs-app:build`.
3. **No dependency or peer-dep changes** — peers remain `^21.0.0` (Phase 3). No lockfile drift.
4. **Angular 22 / `ChangeDetectionStrategy.Eager`** did not break example-app e2e (smoke + console-driver timing tests both green).
