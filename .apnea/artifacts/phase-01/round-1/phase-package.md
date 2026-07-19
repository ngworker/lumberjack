---
status: done
---

# Phase package — Phase 1: Migrate the workspace to Nx 23 + Angular 22 and return the tree to green

Source: approved plan `.apnea/artifacts/plan.md` (Phase 1 only).

## Intent

Run the official Nx migration from **Nx 22.3.3 → 23.1.x**, which also carries the Angular packages from **21.0.9 → 22.0.x**, apply every generated migration, then fix all resulting failures so lint, unit tests, builds, and formatting are fully green. One slice; the tree must be green at the end of this phase.

Do not hand-pick versions. Let `nx migrate` decide every bump. You only intervene when a step below explicitly says so.

## Preconditions

- Working directory: repo root (`/Users/nachovazquez/work/1-projects/ngworkers/lumberjack`).
- Node 22 and pnpm 10 (repo has `packageManager: pnpm@10.11.1`).
- Baseline sanity (optional but recommended): `pnpm exec nx report` should show nx 22.3.3, @angular/core 21.0.9 before you start.

## Exact steps

1. **Generate the migration:**

   ```sh
   pnpm exec nx migrate nx@23.1.0
   ```

   This rewrites dependency versions in `package.json` and creates `migrations.json` at the repo root.

2. **Inspect `package.json`.** Expected after step 1:

   - `nx` and all `@nx/*` packages at `23.1.x`.
   - `@angular/*` (core, common, compiler, forms, router, platform-browser, platform-browser-dynamic, animations, compiler-cli, language-service), `@angular/cli`, `@angular-devkit/*`, `@schematics/angular` at `22.0.x`.
   - `ng-packagr` at `22.x`, `@angular-eslint/*` at `22.x`.
   - Possibly bumped: `typescript`, `zone.js`, `jest-preset-angular`, `@typescript-eslint/*`. Accept whatever the migration wrote.

   **Contingency — Angular not bumped:** if `@angular/core` is still `21.x`, additionally run:

   ```sh
   pnpm exec nx migrate @angular/core@22.0.7
   ```

   If this produces a new `migrations.json`, merge its `migrations` array into the existing file (or run it after the first one completes). Then re-check the expectations above.

3. **Install and run migrations:**

   ```sh
   pnpm install --no-frozen-lockfile
   pnpm exec nx migrate --run-migrations
   ```

   If a migration fails, read its error, fix the cause (usually a config file it couldn't parse), and re-run `pnpm exec nx migrate --run-migrations` — it is safe to re-run.

4. **Delete `migrations.json`** once all migrations have been applied (it is not kept in this repo):

   ```sh
   rm migrations.json
   ```

5. **Fix fallout until green.** Run the verify commands (below) and fix what fails. Likely categories, in the order you'll hit them:

   - **TypeScript/Angular compile errors** in `packages/**` and `e2e/**`: removed or deprecated Angular 22 APIs, stricter template diagnostics. Make the minimal change that preserves existing behavior; do not refactor.
   - **Jest failures**: jest-preset-angular / `jest.config.ts` shape changes, `test-setup.ts` snippet changes (migrations usually rewrite these — verify they did).
   - **Lint failures**: `@angular-eslint` 22 rule renames or new defaults. Fix code where trivial; if a rule rename broke `.eslintrc.json`, update the config to the new rule name with the same severity. Warnings count as failures (`--max-warnings=0`).
   - **ng-packagr / `@nx/angular:package` option changes** in `packages/ngworker/lumberjack/{ng-package.json,project.json}` and the secondary entry points `console-driver/` and `http-driver/`.
   - **`nx.json` / `project.json` option renames** flagged by Nx 23 at startup — apply what the error message says.

6. **Format:**

   ```sh
   pnpm exec nx format:write
   ```

## Files you may touch

- `package.json`, `pnpm-lock.yaml`
- `nx.json`, `tsconfig.base.json`, `jest.config.ts`, `jest.preset.js`, root `.eslintrc.json`
- Per-project config: `project.json`, `tsconfig*.json`, `jest.config.ts`, `.eslintrc.json`, `ng-package.json` under `packages/**` and `e2e/**`
- Source files under `packages/**` and `e2e/**` only where required to fix compile/test/lint errors

## Files you must NOT touch

- `packages/ngworker/lumberjack/package.json` **peerDependencies** (`^21.0.0` stays for now — Phase 3 bumps it). Migrations touching other fields of this file are fine.
- Docusaurus/React deps in root `package.json` (`@docusaurus/*`, `react`, `react-dom`, `@mdx-js/react`, etc.) — leave at current versions unless a migration hard-fails without a change; if so, make the minimal change and note it in your report.
- `.github/workflows/**` (Phase 4).
- `.apnea/**`, `.apnea/state.json`.
- `dist/`, `coverage/`, `tmp/` (build outputs).

## Acceptance checks

1. `pnpm exec nx report` shows **nx 23.1.x** and **@angular/core 22.0.x**.
2. `pnpm run lint` passes with zero warnings (script enforces `--max-warnings=0`).
3. `pnpm run test` passes — all projects.
4. `pnpm run build` passes — all projects, including `ngworker-lumberjack` with both secondary entry points (`console-driver`, `http-driver`) built into `dist/packages/ngworker/lumberjack`.
5. `pnpm exec nx format:check` reports no violations.
6. No `migrations.json` left at the repo root.

## Verify commands (run all, in this order, from repo root)

```sh
pnpm exec nx report
pnpm run lint
pnpm run test
pnpm run build
pnpm exec nx format:check
test ! -f migrations.json && echo "migrations.json removed"
```

All must exit 0.

## Non-goals (do not do these)

- ESLint 9 / flat-config conversion. Stay on ESLint 8.57 + `.eslintrc.json`. **Only if** a required Nx migration hard-requires flat config (workspace cannot run otherwise), do the minimal conversion and flag it prominently in your report.
- Prettier 3 upgrade; Docusaurus/React upgrades; Cypress major upgrade beyond what the migration itself writes.
- Any public-API change to `@ngworker/lumberjack`.
- Peer-dependency bump to `^22.0.0` (Phase 3).
- E2E runs (`pnpm run e2e`) — Phase 2 covers them; don't block this phase on Cypress.
- Editing CI workflows, publishing, tagging, or running `nx release`.
- Committing or pushing (the run harness handles VCS).
