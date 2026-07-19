---
status: done
verdict: APPROVED
nits: |
  - ORCHESTRATOR ATTENTION: `nx format:check` exits 1 right now — the sole violation is
    `.apnea/tasks/code_review-p1-r1-1784478220331.md`, a harness-written dispatch file created
    AFTER the coder's verify run (which was genuinely green). Not a coder defect and the coder is
    forbidden from touching `.apnea/**`. It will resurface in Phase 4's `pnpm run ci`. Decide at
    harness level: add `.apnea/` to `.prettierignore`, or keep `.apnea/**` out of commits.
  - Lint-coverage regression is slightly understated in the coder report: besides the three
    documented incompatible plugins, `plugin:sonarjs/recommended` (v0.17 rule set) and
    `@typescript-eslint/no-extra-semi` (removed in typescript-eslint v8; Prettier covers it) were
    also dropped. Both drops are defensible minimal-conversion choices and the config comments
    acknowledge the sonarjs one, but the report's "retained explicitly-configured rules" framing
    misses them. Consider an ESLint-9 lint-parity pass as follow-up work alongside the already
    -flagged `eslint-plugin-rxjs-x` / `eslint-plugin-perfectionist` replacements.
  - Minor files-touched deviations, all migration-written and harmless: `tools/tsconfig.tools.json`,
    `.gitignore`, `.prettierignore`, `tools/ai-migrations/**` were modified/created but are not in
    the package's "files you may touch" list. `tools/ai-migrations/` can be deleted once review
    rounds conclude.
  - Coder's dependency table omits some migration-written bumps visible in the diff (`@swc/*`,
    `cypress` 15.9.0→15.18.1 minor, `eslint-plugin-cypress` 2→3, `eslint-config-prettier`,
    `ts-jest`) — all consistent with "let nx migrate decide", documentation gap only.
---

# Code review — Phase 1, round 1

## Verdict: APPROVED

## 1. Phase package vs plan — no drift

The package is a faithful, tighter restatement of plan Phase 1: same intent (single migration slice to green), same steps (migrate → install → run-migrations → delete `migrations.json` → fix fallout → format), same acceptance checks and verify commands, same non-goals (ESLint 9 only under hard-requirement contingency, no peer bump, no e2e, no workflow edits). The added "files you may/must-not touch" lists correctly encode the plan's boundaries. No `CHANGES_REQUIRED` against the package.

## 2. Code vs package — compliant (verified against the working tree, not just the report)

**Boundary compliance (checked via `git status`/diffs):**

- `packages/ngworker/lumberjack/package.json` untouched — peers still `^21.0.0` ✓
- `.github/workflows/**` untouched ✓; Docusaurus/React/Prettier deps untouched ✓
- `.apnea/state.json` not edited by the coder ✓
- Change set (49 paths) matches the coder's files-touched list, minus the minor deviations in nits.

**ESLint 9 / flat-config contingency — properly invoked.** I confirmed `@nx/eslint`'s 23.1.0 migration `update-23-1-0-convert-to-flat-config` exists in the installed package and its description states it converts to flat config *for ESLint v9*. The package's non-goal explicitly allowed this under hard-requirement, demanded prominent flagging, and the coder flagged it first in both the fallout section and residual risks. The conversion is minimal and faithful: root config ports `@nx/enforce-module-boundaries` with identical depConstraints, spec-file override, and the two explicitly-tuned rules (`prefer-readonly`, `cognitive-complexity` at 8); the lib config ports directive/component selector rules and `prefer-standalone: off` verbatim.

**Source diffs are behavior-preserving migration output:**

- `provideLumberjackHttpDriver`: `provideHttpClient(withXhr(), ...features)` — preserves the pre-v22 XHR default; consumer-passed features come after and therefore still win (Angular provider ordering), so no public-API break.
- `ChangeDetectionStrategy.Eager` on example-app components = former Default; the conflicting `prefer-on-push` preset rule is disabled with an explanatory comment.
- `ban-types` disable-comments correctly rewritten to `no-unsafe-function-type`.
- `tsconfig.base.json` pins (`strict: false`, `types: ["*"]`, `esModuleInterop: false`, `ignoreDeprecations: "6.0"`) preserve pre-TS6 defaults: I verified the old base had no `strict` (TS5 default false) and the library's own tsconfig sets `strict: true`, so library strictness is unchanged.
- `extendedDiagnostics` suppressions in lib/app tsconfigs match the Angular `strict-safe-navigation-narrow` migration.

## 3. Coder result / evidence — verified where cheap, consistent elsewhere

Independently re-ran: `nx report` (nx 23.1.0, TS 6.0.3, angular-eslint 22.1.0; `@angular/core` 22.0.7 installed) ✓; `pnpm run lint` exit 0 ✓; `migrations.json` absent ✓. Registry cross-check from plan review already confirmed 23.1.0 / 22.0.7 / ng-packagr 22.0.1 / jest-preset-angular 17.0.0 are the real `latest` versions — the coder's bumps match.

`pnpm run test` and `pnpm run build` were not re-run (brief permits relying on claimed evidence); the transcript is detailed and internally consistent (194 lib tests, both secondary entry points built into `dist/packages/ngworker/lumberjack`), and lint/report re-runs corroborate the tree state it describes.

**One live discrepancy, not attributable to the coder:** `nx format:check` exits 1 *now* solely because of this round's harness-written `.apnea/tasks/code_review-p1-r1-1784478220331.md`, created after the coder's green verify run. No workspace file the coder touched has a format violation. Flagged for the orchestrator in nits — it will break Phase 4's `pnpm run ci` if `.apnea/**` stays in the tree unignored by Prettier.

## Acceptance checks

| # | Check | Result |
|---|-------|--------|
| 1 | nx 23.1.x, @angular/core 22.0.x | ✓ re-verified |
| 2 | `pnpm run lint` zero warnings | ✓ re-verified |
| 3 | `pnpm run test` all projects | ✓ per transcript |
| 4 | `pnpm run build` incl. secondary entry points | ✓ per transcript |
| 5 | `nx format:check` clean | ✓ for coder's files; currently dirtied only by a post-run harness artifact (see nits) |
| 6 | no `migrations.json` | ✓ re-verified |
