---
status: done
---

# Phase package — Phase 3: Breaking-change release surface for @ngworker/lumberjack v22

Source: approved plan `.apnea/artifacts/plan.md` (Phase 3 only). Phases 1–2 are merged (`2b4a31c`, `c7db3e1`): workspace is green on Nx 23.1.0 / Angular 22.0.7, e2e suites pass. The library still declares Angular 21 peers — this phase makes the published surface correct for the v22 major.

## Intent

Bump `@ngworker/lumberjack`'s peer dependencies to Angular 22, update the user-facing compatibility documentation, and verify the built dist artifact is correct (peers, secondary entry points). Also record the breaking-change commit convention the merge must use so `nx release` computes **22.0.0**. Small, surgical phase — three files plus verification.

## Grounding facts (verified in repo)

- `packages/ngworker/lumberjack/package.json`: `version: 21.0.1`, peers `"@angular/core": "^21.0.0"`, `"@angular/common": "^21.0.0"`, `"rxjs": ">= 7.8.1 < 8.0.0"`; `@angular/common` and `rxjs` are optional via `peerDependenciesMeta`.
- The **only** compatibility statement in the repo is the table in `packages/docs/lumberjack-docs-app/docs/compatibility.md` (top row currently `| 21.x | 21.x |`). `README.md` and `packages/ngworker/lumberjack/project.md` contain **no** Angular-version or peer-dependency mentions — do not invent additions there.
- Build output lands in `dist/packages/ngworker/lumberjack` with secondary entry points `console-driver/` and `http-driver/`.
- `nx release` (nx.json `release` block) versions from conventional commits; current published version is 21.0.1, so a commit with a breaking-change marker yields 22.0.0.

## Exact steps

1. **Bump peers.** In `packages/ngworker/lumberjack/package.json`, change only these two values:

   ```json
   "@angular/core": "^22.0.0",
   "@angular/common": "^22.0.0",
   ```

   Keep everything else exactly as-is: the rxjs range, `peerDependenciesMeta`, `dependencies` (tslib), and the `version` field (**do not** hand-bump `21.0.1` — `nx release` computes the version at release time).

2. **Update the compatibility table.** In `packages/docs/lumberjack-docs-app/docs/compatibility.md`, add a new top row to the table (keep all existing rows):

   ```
   | 22.x            | 22.x               |
   ```

3. **Rebuild and verify the dist artifact:**

   ```sh
   pnpm exec nx build ngworker-lumberjack
   ```

   Then check `dist/packages/ngworker/lumberjack/`:
   - `package.json` has peers `^22.0.0` for `@angular/core`/`@angular/common` and intact `peerDependenciesMeta`.
   - `console-driver/` and `http-driver/` directories exist with their own entry-point metadata, and the root `exports` map (written by ng-packagr) covers `.`, `./console-driver`, `./http-driver`.
   - `README.md` is present (copied by the build target).

4. **Regression checks** (should be cache-cheap): lint, test, full build.

5. **Record the release convention for the run terminus** — include this verbatim in your coder result so the PR/terminus phase carries it:

   > The merge to `main` for this run must land as a conventional **breaking** commit, e.g. title `feat!: require Angular 22` with footer `BREAKING CHANGE: @ngworker/lumberjack now requires @angular/core >= 22 and @angular/common >= 22 as peer dependencies.` This is what makes `nx release version` compute 22.0.0 from 21.0.1. A plain `feat:` would incorrectly produce 21.1.0.

   Do not commit anything yourself; the harness handles VCS.

## Files you may touch

- `packages/ngworker/lumberjack/package.json` (the two peer ranges only)
- `packages/docs/lumberjack-docs-app/docs/compatibility.md` (one table row)
- Nothing else should need edits. If verification exposes a genuine defect (e.g. broken exports map in dist), make the minimal fix in `packages/ngworker/lumberjack/**` config and flag it prominently.

## Files you must NOT touch

- Root `package.json` / `pnpm-lock.yaml` (no dependency changes)
- Library source under `packages/ngworker/lumberjack/src/**` and the driver `src/**` trees (no API changes)
- `README.md`, `packages/ngworker/lumberjack/project.md` (no compatibility claims exist there; don't add any)
- `.github/workflows/**` (Phase 4)
- `.apnea/**`, `.apnea/state.json`; `dist/`, `coverage/`, `tmp/` (edit sources, never dist — dist verification is read-only)

## Acceptance checks

1. Source `packages/ngworker/lumberjack/package.json` peers: `@angular/core` and `@angular/common` at `^22.0.0`; rxjs range and `peerDependenciesMeta` unchanged; `version` still `21.0.1`.
2. `dist/packages/ngworker/lumberjack/package.json` reflects the new peers, and both secondary entry points are present in the build output with a correct `exports` map.
3. `docs/compatibility.md` table's top row maps Angular `22.x` → Lumberjack `22.x`; no other rows changed.
4. Lint, test, and build all green.
5. Breaking-change commit convention recorded in the coder result (step 5 text).

## Verify commands (run all, in this order, from repo root)

```sh
pnpm exec nx build ngworker-lumberjack
node -e "const p=require('./dist/packages/ngworker/lumberjack/package.json'); console.log(p.version, JSON.stringify(p.peerDependencies)); if(p.peerDependencies['@angular/core']!=='^22.0.0'||p.peerDependencies['@angular/common']!=='^22.0.0') process.exit(1)"
node -e "const p=require('./dist/packages/ngworker/lumberjack/package.json'); const e=p.exports||{}; if(!e['./console-driver']||!e['./http-driver']) { console.error('missing secondary entry point exports', Object.keys(e)); process.exit(1) } console.log('exports ok')"
test -d dist/packages/ngworker/lumberjack/console-driver && test -d dist/packages/ngworker/lumberjack/http-driver && echo "entry point dirs ok"
grep -n "| 22.x" packages/docs/lumberjack-docs-app/docs/compatibility.md
pnpm run lint
pnpm run test
pnpm run build
```

All must exit 0.

## Non-goals (do not do these)

- Running `nx release`, versioning, tagging, publishing, or editing CI workflows (Phase 4 verifies release readiness; publish happens outside the run).
- Hand-editing the `version` field anywhere.
- Any public-API or source change to the library or drivers.
- Dependency upgrades; e2e re-runs (Phase 2 proved them; only re-run if you somehow touch app/library behavior — you shouldn't).
- Restoring dropped ESLint plugins or other Phase 1 follow-ups.
- Committing or pushing (the run harness handles VCS).
