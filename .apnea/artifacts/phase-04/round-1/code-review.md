---
status: done
verdict: APPROVED
nits: |
  - Coder residual risk 1 slightly overstates the constraint: Nx's restriction is one-directional
    (top-level `release.git` may not be used with subcommands; the granular
    `release.version.git`/`release.changelog.git` layout is honored by subcommands and is the
    forward-compatible form). The conservative warning does no harm, but nobody should feel
    obliged to flip the config back for occasional bare `nx release` use without testing first.
  - TERMINUS REMINDER (the single most important carry-forward of the run): the dry-run computes
    21.1.0 today because all run commits are plain `feat:`. The merge to `main` MUST land as
    `feat!: require Angular 22` with the `BREAKING CHANGE:` footer recorded in the Phase 3/4
    coder results, or the release pipeline will publish 21.1.0 instead of 22.0.0.
---

# Code review — Phase 4, round 1

## Verdict: APPROVED

## 1. Phase package vs plan — no drift

The package matches plan Phase 4: dry-run versioning, workflow sanity-read, full local CI, no release side effects. Its grounding facts all verified: Phases 1–3 merged (`2b4a31c`, `c7db3e1`, `d40df11` in `git log`); `.apnea/` is in `.prettierignore` (landed with the Phase 1 merge, resolving the format:check issue my earlier reviews flagged); the expected-21.1.0-today framing is exactly right given the three plain `feat:` run commits. The package's pre-authorization of a minimal `nx.json` fix if the dry-run errors on release config mirrors the plan's own risk item ("nx release behavior changes in Nx 23"). No `CHANGES_REQUIRED` against the package.

## 2. Code vs package — one pre-authorized fix, verified necessary and minimal

The only non-`.apnea` change is `nx.json`, exactly as the package's contingency allowed. I verified the fix was genuinely required and correctly shaped:

- **The error was real:** the exact string `The "release.git" property in nx.json may not be used with the …` exists in the installed Nx 23 package. With the old top-level `release.git`, `nx release version --dry-run` (used by this phase and by any subcommand-based flow) fails hard.
- **The fix is the documented remedy:** the same `{ commit: true, commitArgs: "--no-verify" }` block moved under both `release.version.git` and `release.changelog.git` — semantics preserved for both subcommands.
- **The `commitMessageFormat` drop is substantiated:** the installed Nx 23 `nx-schema.json` changelog properties are only `automaticFromRef`, `git`, `projectChangelogs`, `workspaceChangelog` — `commitMessageFormat` is no longer a valid key.

No forbidden files touched: no `package.json` edits anywhere, no workflow/prettierignore/source changes, no tags, no publish.

## 3. Coder result / evidence — fully re-verified

I re-ran every verify command myself; all match the transcript:

- `nx release version --dry-run` — **exit 0**, resolves current version 21.0.1 from tag `v21.0.1`, specifier "minor" from conventional commits, computes **21.1.0**; source `package.json` still `21.0.1` afterwards and the tree shows no dry-run side effects.
- `nx format:check` — **exit 0** (the `.apnea/` prettierignore entry works; Phase 1's standing concern is closed).
- `pnpm run ci` — **exit 0** end-to-end: lint (7 projects), test (4 projects), build (incl. `build-package` for the lib), both e2e suites live-passing (docs 2/2, examples 3/3).
- `git status` — only the flagged `nx.json` change outside `.apnea/`; `git tag` still heads at `v21.0.1`; no release/tag/publish side effects.

Workflow sanity-read claims spot-checked directly: `.nvmrc` = 22 and the setup action derives Node from it; jest targetDefaults carry the `ci` configuration (so CI's `test:ci` remains valid); `nx-release-publish.options.packageRoot` = `dist/{projectRoot}` matching where ng-packagr writes; release/docs paths already confirmed in prior rounds. The coder's per-file confirmation tables are accurate.

The terminus report requirements (computed version + why, breaking-commit convention verbatim, no-publish confirmation) are all present in the coder result.

## Acceptance checks

| # | Check | Result |
|---|-------|--------|
| 1 | Dry-run exit 0, version recorded, 22.0.0-via-`feat!:` documented | ✓ re-verified (21.1.0) |
| 2 | Workflow sanity-read with explicit confirmations | ✓ tables accurate; spot-checked |
| 3 | `nx format:check` exit 0 | ✓ re-verified |
| 4 | `pnpm run ci` exit 0 | ✓ re-run, all green |
| 5 | Tree unchanged except flagged `nx.json` fix | ✓ verified |
| 6 | No tag/release/publish side effects | ✓ verified (tags head at v21.0.1) |
