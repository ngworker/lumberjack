---
status: done
---

# Phase package — Phase 4: Release readiness verification

Source: approved plan `.apnea/artifacts/plan.md` (Phase 4 only). Phases 1–3 are merged (`2b4a31c`, `c7db3e1`, `d40df11`): workspace green on Nx 23.1.0 / Angular 22.0.7, e2e green, library peers now `^22.0.0`. This phase verifies the release machinery will produce v22.0.0 — it does **not** release anything.

## Intent

Confirm (a) `nx release` versioning runs cleanly under Nx 23, (b) the GitHub CI/release workflows still match the migrated workspace, and (c) the full local CI equivalent passes. Read-mostly phase; expected diff is zero unless a workflow mismatch introduced by the migration is found.

## Grounding facts (verified in repo — read these before starting)

- Latest release tags: `v21.0.1` (plus a `last-release` tag). `nx.json` `release` block: projects `["ngworker-lumberjack"]`, conventional commits, `preVersionCommand: pnpm exec nx run-many -t build`, GitHub-release changelog, tag pattern `v{version}`.
- Commits on `main` since `v21.0.1` are the three run commits, all plain `feat:` (no `!`/`BREAKING CHANGE`). **Therefore `nx release version --dry-run` is expected to compute `21.1.0` today.** That is correct machinery behavior, not a failure: the 22.0.0 major materializes only when the terminus commit lands as `feat!: require Angular 22` with the `BREAKING CHANGE:` footer recorded in the Phase 3 coder result. Do not "fix" this by hand-bumping versions or rewriting commits.
- `.apnea/` is already listed in `.prettierignore` (the format:check concern flagged in Phase 1/3 reviews is resolved) — verify rather than re-fix.
- `pnpm run ci` = `lint && test && build && e2e` (no format:check inside it; CI workflow runs `nx format:check` separately).
- Workflows: `.github/workflows/ci.yml` (Node 22, pnpm 10, `nx format:check`, `nx affected -t lint test:ci build e2e`, SonarCloud job), `.github/workflows/release.yml` (build `ngworker-lumberjack`, `nx release publish --projects=ngworker-lumberjack`, docs deploy from `dist/packages/docs/lumberjack-docs-app/`), composite action `.github/actions/setup/action.yml`.

## Exact steps

1. **Version dry-run:**

   ```sh
   pnpm exec nx release version --dry-run
   ```

   - Must exit 0. The `preVersionCommand` will build all projects first (cache-cheap).
   - Record the computed version in your report. Expected: `21.1.0` given current history (see grounding facts). If it errors on the `release` config (Nx 23 schema change), make the minimal `nx.json` fix the error message dictates and re-run.
   - A `--dry-run` must not modify files or create tags — if `git status` shows changes afterwards other than untracked harness files, revert them and investigate before proceeding.

2. **Workflow sanity-read** (change only what the migration broke; expect no changes):

   - `ci.yml`: Node 22 and pnpm 10 still match `package.json` engines; targets `lint`, `test:ci` (test target's `ci` configuration still exists in `nx.json` targetDefaults / lumberjack `project.json`), `build`, `e2e` all still exist as (inferred) targets — cross-check with `pnpm exec nx show project ngworker-lumberjack` and `pnpm exec nx show project examples-lumberjack-app-e2e`.
   - `release.yml`: `nx build ngworker-lumberjack` and `nx release publish --projects=ngworker-lumberjack` still valid; publish `packageRoot` (`dist/{projectRoot}` from nx.json `nx-release-publish` targetDefault) still matches where the build writes (`dist/packages/ngworker/lumberjack`); docs deploy path `dist/packages/docs/lumberjack-docs-app/` still matches the docs build output.
   - `.github/actions/setup/action.yml`: still installs with pnpm and derives Node version consistently.
   - If everything matches (expected), state that explicitly in your report with the checks you performed. If a mismatch traces to the migration (e.g. renamed target), fix minimally in the workflow file and flag it.

3. **Format check** (confirms the `.apnea/` prettierignore entry works):

   ```sh
   pnpm exec nx format:check
   ```

4. **Full local CI equivalent:**

   ```sh
   pnpm run ci
   ```

   Runs lint, test, build, and both e2e suites serially. Cypress binary is already installed (Phase 2); if a fresh environment complains, `pnpm exec cypress install` first.

5. **Report for the terminus.** Restate in your coder result:
   - The computed dry-run version and why it differs from 22.0.0 (pending breaking commit).
   - The exact breaking-commit convention from the Phase 3 coder result (`feat!: require Angular 22` + `BREAKING CHANGE:` footer).
   - Confirmation that publish/tag/GitHub-release were **not** executed.

## Files you may touch

- `nx.json` — only if `nx release version --dry-run` errors on the release config, minimal fix per the error.
- `.github/workflows/ci.yml`, `.github/workflows/release.yml`, `.github/actions/setup/action.yml` — only for mismatches introduced by the migration, minimal, flagged in the report.
- Expected outcome: **no files changed.**

## Files you must NOT touch

- Any `package.json` (root or projects) — no version or dependency edits.
- Library/app/docs source and config (Phases 1–3 are closed).
- `.prettierignore` (`.apnea/` entry already present — verify, don't edit).
- `.apnea/**`, `.apnea/state.json`; `dist/`, `coverage/`, `tmp/`.
- Git state: no commits, no tags, no `nx release version` without `--dry-run`, no `nx release publish`, no pushes.

## Acceptance checks

1. `pnpm exec nx release version --dry-run` exits 0; computed version recorded (expected `21.1.0` pre-breaking-commit) and the 22.0.0-via-`feat!:` dependency documented in the report.
2. Workflow sanity-read completed with explicit per-file confirmation or minimal flagged fixes.
3. `pnpm exec nx format:check` exits 0.
4. `pnpm run ci` exits 0 end-to-end (lint, test, build, both e2e suites).
5. Working tree unchanged afterwards (aside from harness-written `.apnea/**` files), unless a flagged workflow/nx.json fix was required.
6. No tag, release, or publish side effects (`git tag` list unchanged; no new GitHub release).

## Verify commands (run all, in this order, from repo root)

```sh
pnpm exec nx release version --dry-run
pnpm exec nx format:check
pnpm run ci
git status --short
git tag --sort=-creatordate | head -3
```

First three must exit 0; `git status` must show no non-`.apnea` changes (unless flagged fixes were made); tag list must still start at `v21.0.1`.

## Non-goals (do not do these)

- Actually versioning, tagging, publishing, creating GitHub releases, or deploying docs — the run ends at readiness; the real release happens via `release.yml` after the terminus merge.
- Hand-bumping any version to force 22.0.0; rewriting or amending commits to add the breaking marker (that is the terminus merge's job, handled by the harness/PR flow).
- Dependency upgrades, lint-parity work (dropped ESLint plugins), TS deprecation cleanup — out of this run.
- Editing workflows for improvements unrelated to the migration.
- Committing or pushing (the run harness handles VCS).
