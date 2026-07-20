---
status: done
---

# Coder result — Phase 4: Release readiness verification

## What changed

One migration-required fix in `nx.json` release config; workflows untouched.

### `nx.json` — Nx 23 release git config split (**flagged**)

`pnpm exec nx release version --dry-run` failed immediately:

```
The "release.git" property in nx.json may not be used with the "nx release version"
subcommand or programmatic API. Instead, configure git options for subcommands
directly with "release.version.git" and "release.changelog.git".
```

Minimal fix:

- Removed top-level `release.git`
- Moved the same `{ commit: true, commitArgs: "--no-verify" }` under:
  - `release.version.git`
  - `release.changelog.git`
- Dropped invalid `changelog.commitMessageFormat: "conventional"` (not in the Nx 23 changelog schema; was co-located with the git block being rewritten)

No other files changed. No version hand-bumps, no tags, no publish.

## Files touched

- `nx.json` (release git config only)

## Workflow sanity-read (no edits needed)

### `.github/workflows/ci.yml` — matches

| Check     | Result                                                                                                                 |
| --------- | ---------------------------------------------------------------------------------------------------------------------- |
| Node 22   | `actions/setup-node` `node-version: 22`; engines `node: '>=22'`; `.nvmrc` = `22`                                       |
| pnpm 10   | `pnpm/action-setup@v2` `version: 10`; engines `pnpm: '>=10'`; `packageManager: pnpm@10.11.1`                           |
| Targets   | `nx format:check` + `nx affected -t lint test:ci build e2e`                                                            |
| `lint`    | present (inferred via `@nx/eslint/plugin`)                                                                             |
| `test:ci` | `test` target has `configurations.ci` (`ci: true`, `coverage`/`codeCoverage: true`) via `@nx/jest:jest` targetDefaults |
| `build`   | present on apps/lib                                                                                                    |
| `e2e`     | present on both e2e projects (inferred via `@nx/cypress/plugin`; also `e2e-ci`)                                        |

### `.github/workflows/release.yml` — matches

| Check                                               | Result                                                                                                                                                                                               |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Node 22 / pnpm 10                                   | same as CI                                                                                                                                                                                           |
| `nx build ngworker-lumberjack`                      | valid                                                                                                                                                                                                |
| `nx release publish --projects=ngworker-lumberjack` | valid                                                                                                                                                                                                |
| Publish package root                                | targetDefault `nx-release-publish.options.packageRoot` = `dist/{projectRoot}` resolves for this project to `dist/packages/ngworker/lumberjack` (confirmed via `nx show project ngworker-lumberjack`) |
| Docs deploy path                                    | `dist/packages/docs/lumberjack-docs-app/` matches docs build output                                                                                                                                  |

### `.github/actions/setup/action.yml` — matches

- Derives Node from `.nvmrc` (`22`)
- pnpm 10 + `pnpm install`
- Sets bot git user for changelog commits

### Other verifications

- `.prettierignore` already lists `.apnea/` (line 17) — format:check clean without re-editing it.
- `nx-release-publish` options and secondary entry points still correct from Phase 3.

## Verify transcript

### 1. `pnpm exec nx release version --dry-run` — exit 0 (after nx.json fix)

```
NX   Running release version for project: ngworker-lumberjack

ngworker-lumberjack 🏷️  Resolved the current version as 21.0.1 from git tag "v21.0.1",
                       based on releaseTag.pattern "v{version}"
ngworker-lumberjack 📄 Resolved the specifier as "minor" using git history and
                       the conventional commits standard
ngworker-lumberjack ❓ Applied semver relative bump "minor", ... new version 21.1.0
ngworker-lumberjack ✍️  New version 21.1.0 written to manifest:
                       packages/ngworker/lumberjack/package.json

UPDATE packages/ngworker/lumberjack/package.json [dry-run]
-   "version": "21.0.1",
+   "version": "21.1.0",

NOTE: The "dryRun" flag means no changes were made.
```

**Computed version: `21.1.0`** (expected). Source `package.json` remains `21.0.1` after dry-run.

### 2. `pnpm exec nx format:check` — exit 0

```
EXIT_FORMAT:0
```

### 3. `pnpm run ci` — exit 0

```
# lint + test + build green (cache-heavy)
# e2e:
docs-lumberjack-docs-app-e2e: 2 passing (home.cy.ts)
examples-lumberjack-app-e2e:  3 passing (app.cy.ts + console-driver.cy.ts)
NX   Successfully ran target e2e for 2 projects and 3 tasks they depend on
EXIT_CI:0
```

### 4. `git status --short` / tags

```
 M nx.json                    # intentional Phase 4 fix
 M .apnea/state.json          # harness
?? .apnea/artifacts/phase-04/ # harness
?? .apnea/tasks/...           # harness

tags (newest first): v21.0.1, v21.0.0, v20.0.0
lib version still 21.0.1
```

No non-`.apnea` changes beyond the flagged `nx.json` fix. Tag list unchanged (still heads at `v21.0.1`). No publish/tag/release side effects.

## Report for the terminus

1. **Dry-run computed `21.1.0`**, not `22.0.0`. That is correct machinery behavior: commits on `main` since `v21.0.1` are plain `feat:` (no `!` / `BREAKING CHANGE`). Conventional-commits therefore resolves a **minor** bump.

2. **22.0.0 materializes only when the terminus merge lands as a breaking commit**, per the Phase 3 convention:

   > The merge to `main` for this run must land as a conventional **breaking** commit, e.g. title `feat!: require Angular 22` with footer `BREAKING CHANGE: @ngworker/lumberjack now requires @angular/core >= 22 and @angular/common >= 22 as peer dependencies.` This is what makes `nx release version` compute 22.0.0 from 21.0.1. A plain `feat:` would incorrectly produce 21.1.0.

3. **Publish / tag / GitHub-release were not executed.** Only `--dry-run` versioning, format check, and full local CI. Real release remains via `release.yml` after the terminus merge.

## Residual risks

1. **Nx 23 git config split** — subcommands (`version`/`changelog`/`publish`) now need granular `release.version.git` / `release.changelog.git`. Top-level `nx release` (all-in-one) would want the inverse (`release.git` only). Current CI/release workflows use `nx release publish` (subcommand) and GitHub's native `release` event for tagging, so the granular layout matches actual usage. If anyone runs bare `nx release` locally, they will need the top-level form instead.
2. **Dropped `commitMessageFormat`** — it was not a valid changelog schema key under Nx 23. If it previously affected commit messages via some undocumented path, that behavior is gone; default conventional commit messages from nx release apply.
3. **Dry-run shows 21.1.0 until the breaking terminus commit lands** — do not hand-bump or rewrite history to force 22.0.0; the harness/PR flow owns that.
4. **Docs e2e teardown** still occasionally logs a non-zero `docusaurus serve` exit after green specs (Phase 2 residual); overall `e2e`/`ci` exit 0.
5. **No actual npm publish or GitHub release** in this phase — readiness only.
