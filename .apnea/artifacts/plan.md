---
status: done
---

# Plan: Migrate to latest Nx + Angular and prepare the breaking-change release

## Goal restatement

Upgrade the lumberjack workspace from **Nx 22.3.3 → Nx 23.1.x** and **Angular 21.0.9 → Angular 22.0.x** (current `latest` on npm as of 2026-07-19: nx 23.1.0, @angular/core 22.0.7), so that `@ngworker/lumberjack` can ship its next **breaking-change major (v22.0.0)** with `@angular/core`/`@angular/common` peer dependencies of `^22.0.0`. Releases are computed by `nx release` from conventional commits, so the breaking change must be expressed through a `!`/`BREAKING CHANGE` commit when the work lands.

## Current state (verified in repo)

- Root deps: Angular 21.0.9, `@angular/cli` 21.0.6, ng-packagr 21.0.1, TypeScript 5.9.3, zone.js 0.16.0, rxjs 7.8.1.
- Nx 22.3.3 with inferred targets via `@nx/cypress`, `@nx/eslint`, `@nx/jest` plugins; pnpm 10 (`packageManager: pnpm@10.11.1`), Node 22.
- Test/lint stack: Jest 30 + jest-preset-angular 16.0.0, ESLint 8.57 with `.eslintrc.json` (legacy config) + typescript-eslint 7, Cypress 15.9.0, Prettier 2.8.1.
- Publishable project: `ngworker-lumberjack` (`packages/ngworker/lumberjack`, v21.0.1, peers `^21.0.0`) with secondary entry points `console-driver` and `http-driver`; built with `@nx/angular:package` (ng-packagr) into `dist/packages/ngworker/lumberjack`.
- Other projects: `packages/internal/{test-util,console-driver}`, example app `packages/examples/lumberjack-app`, Docusaurus docs app `packages/docs/lumberjack-docs-app`, Cypress e2e apps under `e2e/`.
- Release: `nx release` (independent, conventional commits, GitHub release, tag `v{version}`) driven by `.github/workflows/release.yml`; CI in `.github/workflows/ci.yml` runs `nx format:check` + `nx affected -t lint test:ci build e2e`.
- `.apnea/artifacts/plan-review/` is empty → this is the initial plan, not rework.

## Phases

### Phase 1 — Migrate the workspace to Nx 23 + Angular 22 and return the tree to green

**Intent:** One coherent migration slice: run the Nx migration (which also updates the Angular packages to the version Nx 23.1 supports, i.e. Angular 22), apply all generated migrations, and fix every resulting compile/test/lint failure so the tree is fully green again.

**Steps (for the coder):**

1. `pnpm exec nx migrate nx@23.1.0` — updates `package.json` and writes `migrations.json`.
2. Confirm `package.json` now points at `@nx/*` 23.1.x and `@angular/*` 22.0.x (including `@angular/cli`, `@angular-devkit/*`, `@schematics/angular`, `@angular/compiler-cli`, ng-packagr 22.x, `@angular-eslint/*` 22.x). If the Angular packages were **not** bumped to 22, additionally run `pnpm exec nx migrate @angular/core@22.0.7` and merge the resulting migrations.
3. `pnpm install --no-frozen-lockfile`, then `pnpm exec nx migrate --run-migrations`.
4. Accept related transitive bumps the migration requires (typical candidates: `typescript`, `zone.js`, `jest-preset-angular`, `@typescript-eslint/*`). Do not hand-upgrade anything the migration doesn't require.
5. Delete `migrations.json` after it has been applied (repo convention: it is not committed).
6. Fix fallout across all projects until lint, unit tests, and builds pass: deprecated/removed Angular APIs, template diagnostics, jest-preset-angular config changes, ng-packagr schema changes, `nx.json`/`project.json` option renames.
7. Run `pnpm exec nx format:write` at the end so `nx format:check` passes in CI.

**Files likely touched:** `package.json`, `pnpm-lock.yaml`, `nx.json`, `tsconfig.base.json`, per-project `project.json` / `tsconfig*.json` / `jest.config.ts`, source files under `packages/**` and `e2e/**` where APIs changed.

**Not to touch:** `packages/ngworker/lumberjack/package.json` peer ranges (Phase 3), Docusaurus/React deps (only if the migration forces them), `.github/workflows/*`, `.apnea/**`.

**Acceptance checks:**

- `pnpm exec nx report` shows nx 23.1.x and @angular/core 22.0.x.
- Every project lints, tests, and builds with zero failures and `--max-warnings=0` respected.
- No leftover `migrations.json`.

**Verify commands:**

```sh
pnpm exec nx report
pnpm run lint
pnpm run test
pnpm run build
pnpm exec nx format:check
```

**Dependencies:** none.

**Non-goals:** ESLint 9 / flat-config conversion (keep `.eslintrc.json` on ESLint 8.57 unless a required migration forces the switch — if forced, do the minimal conversion and note it in the phase report), Prettier 3 upgrade, Docusaurus upgrade, any public-API changes to the library.

### Phase 2 — E2E and docs apps green on the new stack

**Intent:** Prove the migrated library works end-to-end: Cypress e2e suites for the example app and the docs app pass, and the Docusaurus docs app still builds against the migrated workspace.

**Steps:** run the e2e targets, fix any Cypress/config or app-level fallout from Phase 1 (e.g. dev-server target renames, Cypress config schema changes), and ensure `docs-lumberjack-docs-app` builds.

**Files likely touched:** `e2e/**` (cypress configs, specs), `packages/examples/lumberjack-app/**`, `packages/docs/lumberjack-docs-app/**` (config only).

**Acceptance checks:**

- Both e2e projects pass locally.
- Docs app production build succeeds.

**Verify commands:**

```sh
pnpm run e2e
pnpm exec nx build docs-lumberjack-docs-app
```

**Dependencies:** Phase 1.

**Non-goals:** new e2e coverage, docs content changes.

### Phase 3 — Breaking-change release surface for @ngworker/lumberjack v22

**Intent:** Make the published package correct for the new major: peer ranges, package metadata, and user-facing compatibility docs.

**Steps:**

1. In `packages/ngworker/lumberjack/package.json`, bump `peerDependencies` to `"@angular/core": "^22.0.0"`, `"@angular/common": "^22.0.0"` (keep the rxjs range and `peerDependenciesMeta` as-is).
2. Update any Angular/Nx compatibility statements in `README.md`, `packages/ngworker/lumberjack/project.md`, and the docs site (search for "21" version-compatibility mentions; update only compatibility tables/statements, not history).
3. Verify the built artifact: build the package and inspect `dist/packages/ngworker/lumberjack/package.json` for correct peers, exports for `console-driver` and `http-driver` secondary entry points, and partial-Ivy compilation.
4. Record for the run terminus: the merge commit/PR title must be a conventional **breaking** change (e.g. `feat!: require Angular 22`) with a `BREAKING CHANGE:` footer describing the peer bump, so `nx release version` computes `22.0.0` from v21.0.1. (Planner note: agents in this run must not commit; this lands via the normal PR flow.)

**Files likely touched:** `packages/ngworker/lumberjack/package.json`, `README.md`, `packages/ngworker/lumberjack/project.md`, docs pages under `packages/docs/lumberjack-docs-app/**`.

**Acceptance checks:**

- `dist/packages/ngworker/lumberjack/package.json` shows peers `^22.0.0` and both secondary entry points resolve.
- No remaining "Angular 21" compatibility claims in README/docs.

**Verify commands:**

```sh
pnpm exec nx build ngworker-lumberjack
node -e "const p=require('./dist/packages/ngworker/lumberjack/package.json'); console.log(p.version, p.peerDependencies); if(p.peerDependencies['@angular/core']!=='^22.0.0') process.exit(1)"
pnpm run lint
pnpm run test
```

**Dependencies:** Phase 1 (Phase 2 recommended first but not strictly blocking).

**Non-goals:** actually running `nx release`/publishing; changing the library's public API; renaming entry points.

### Phase 4 — Release readiness verification

**Intent:** Confirm the release machinery will produce v22.0.0 with the migrated toolchain before anything is tagged.

**Steps:**

1. Dry-run versioning: `pnpm exec nx release version --dry-run` (its `preVersionCommand` builds all projects) and confirm the computed next version for `ngworker-lumberjack` is a major (22.0.0) given a breaking-change commit — if run before the breaking commit exists on the branch, verify instead that the machinery runs cleanly and document that the major bump depends on the merge-commit format from Phase 3.
2. Sanity-check `.github/workflows/ci.yml` and `release.yml` still match reality after migration (Node 22, pnpm 10, target names `lint test:ci build e2e`, `nx release publish --projects=ngworker-lumberjack`, `dist/packages/docs/lumberjack-docs-app` path). Fix only mismatches introduced by the migration.
3. Full local CI equivalent: `pnpm run ci`.

**Files likely touched:** possibly `.github/workflows/ci.yml`, `.github/workflows/release.yml`; otherwise none.

**Acceptance checks:**

- `nx release version --dry-run` completes without error and the version resolution behaves as described above.
- `pnpm run ci` passes end-to-end.

**Verify commands:**

```sh
pnpm exec nx release version --dry-run
pnpm run ci
```

**Dependencies:** Phases 1–3.

**Non-goals:** publishing to npm, creating tags or GitHub releases, deploying docs.

## Risks / contingencies

- **ESLint stack:** ESLint 8.57 + typescript-eslint 7 + legacy `.eslintrc.json` is old; Nx 23 migrations may push toward ESLint 9 flat config. Preferred path is staying on the current lint stack for this run; if a migration hard-requires the switch, do the minimal flat-config conversion in Phase 1 and flag it in the artifact.
- **jest-preset-angular 16.0.0** may need a minor/major bump for Angular 22; take whatever version the Nx/Angular migration specifies.
- **Docusaurus (React 18, Docusaurus 3.3)** shares the root `package.json`; the Angular migration must not touch it, but watch for pnpm peer-resolution noise after the lockfile update. Deviations get fixed with lockfile-level resolution, not by upgrading Docusaurus.
- **`nx release` behavior changes in Nx 23:** verify the `release` block in `nx.json` still validates (Phase 4 dry-run catches this).

## Definition of done (whole run)

1. Workspace on Nx 23.1.x and Angular 22.0.x (`pnpm exec nx report` confirms).
2. `pnpm run ci` (lint + test + build + e2e) passes locally; `nx format:check` clean.
3. `@ngworker/lumberjack` peers require `^22.0.0`, and the built dist artifact reflects it with both secondary entry points intact.
4. `pnpm exec nx release version --dry-run` runs cleanly, with the v22.0.0 major bump guaranteed by the documented breaking-change commit convention for the merge.
5. README/docs compatibility statements updated to Angular 22; no publish, tag, or state-file changes performed by run agents.
