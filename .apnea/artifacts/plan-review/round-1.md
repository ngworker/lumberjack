---
status: done
verdict: APPROVED
nits: |
  - jest-preset-angular latest is 17.0.0 (registry-checked), so the Phase 1 risk item is a guaranteed 16→17 major bump, not a "may need"; the coder should expect setup-file/config changes from its v17 migration notes.
  - Phase 1/4 verify uses `pnpm run test` while CI runs the `ci` configuration (`test:ci`, `--parallel=1 --max-workers=2`); if any suite is flaky only under the ci configuration, local verify won't catch it. Optionally add `pnpm exec nx run-many --target=test --configuration=ci` to Phase 4.
  - The goal says "release the new version"; the plan correctly stops at release *readiness* (agents cannot commit/publish). Phase 3 step 4 documents this, but the run terminus should surface it prominently to the user so the `feat!` merge-commit requirement isn't lost.
---

# Plan review — round 1

## Verdict: APPROVED

## Verification performed (all claims checked against repo + npm registry)

- **Version anchors are exact:** `nx@latest` = 23.1.0, `@angular/core@latest` = 22.0.7, `ng-packagr@latest` = 22.0.1 — matches the plan's stated targets as of 2026-07-19.
- **Current-state section is accurate:** root `package.json` confirms Angular 21.0.9, Nx 22.3.3, pnpm@10.11.1, Node 22, Jest 30 + jest-preset-angular 16.0.0, ESLint 8.57 + typescript-eslint 7 (legacy `.eslintrc.json`), Cypress 15.9.0, Prettier 2.8.1, TS 5.9.3.
- **Library state accurate:** `packages/ngworker/lumberjack/package.json` is v21.0.1 with peers `^21.0.0` and `peerDependenciesMeta` (common/rxjs optional); `console-driver` and `http-driver` secondary entry points exist on disk.
- **Release machinery claims accurate:** `nx.json` release block targets `ngworker-lumberjack`, independent relationship, `conventionalCommits: true`, `preVersionCommand` builds all; `release.yml` runs `nx release publish --projects=ngworker-lumberjack`; docs artifact path `dist/packages/docs/lumberjack-docs-app/` confirmed.
- **CI claims accurate:** `ci.yml` runs `nx format:check` then `nx affected -t lint test:ci build e2e` on Node 22 + pnpm.
- **`migrations.json` convention confirmed:** it is in `.gitignore` (line 45), so "delete after applying, don't commit" is the actual repo convention.
- **Verify commands all exist and are sane:** `pnpm run lint/test/build/e2e/ci` are real root scripts; `nx format:check`, `nx report`, `nx build`, and the Phase 3 `node -e` peer-check are non-destructive and non-empty. `nx release version --dry-run` is safe despite `git.commit: true` in `nx.json` (dry-run makes no changes).

## Findings by severity

No blocking findings.

**Structure:** All four phases are vertical slices with intent, explicit steps, files-touched boundaries, acceptance checks, verify commands, dependencies, and non-goals. Phase ordering (migrate → e2e/docs proof → release surface → release-readiness dry-run) is coherent and dependency edges are correct.

**Scope:** Non-goals are well-drawn — ESLint 9 flat config deferred with a documented contingency, Docusaurus/React held stable with a lockfile-level fallback, no publishing/tagging by agents. The Phase 1 "not to touch" list correctly fences off peer ranges (Phase 3) and workflows (Phase 4).

**Risks:** The four called-out risks (ESLint stack pressure, jest-preset-angular bump, Docusaurus peer-resolution noise, `nx release` schema changes in Nx 23) are the right ones for this workspace, each with a contingency. See nits for one sharpening (jest-preset-angular is a certain major, not a maybe).

Minor observations that do not block are recorded in the `nits` front-matter.
