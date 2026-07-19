---
status: done
---

# Coder result — Phase 1: Nx 23 + Angular 22 migration

## What changed

Ran the official `nx migrate nx@23.1.0` path (Nx decided every bump), installed, applied all 48 migrations (re-ran after fixing a mid-migration graph failure caused by removed typescript-eslint rules still present in the newly converted flat config), deleted `migrations.json`, then fixed fallout until green.

### Dependency bumps (from migrate, not hand-picked)

| Package family                                             | From   | To                                                              |
| ---------------------------------------------------------- | ------ | --------------------------------------------------------------- |
| `nx` / `@nx/*`                                             | 22.3.3 | **23.1.0**                                                      |
| `@angular/*`                                               | 21.0.9 | **22.0.7**                                                      |
| `@angular-devkit/*`, `@angular/cli`, `@schematics/angular` | 21.0.6 | **22.0.7**                                                      |
| `@angular-eslint/*`                                        | 21.1.0 | **22.1.0**                                                      |
| `ng-packagr`                                               | 21.0.1 | **22.0.1**                                                      |
| `typescript`                                               | 5.9.3  | **6.0.3**                                                       |
| `eslint`                                                   | 8.57.0 | **9.9.1** (required by the Nx convert-to-flat-config migration) |
| `@typescript-eslint/*`                                     | 7.18.0 | **8.64.0**                                                      |
| `jest-preset-angular`                                      | 16.0.0 | **17.0.0**                                                      |
| `jest`                                                     | 30.0.5 | **30.3.0**                                                      |
| `zone.js`                                                  | 0.16.0 | **0.16.2**                                                      |
| `eslint-plugin-sonarjs`                                    | 0.17.0 | **4.2.0** (manual — only ESLint-9-compatible version)           |

`packages/ngworker/lumberjack/package.json` **peerDependencies** left at `^21.0.0` (Phase 3).

### Migration-applied source/config edits

- Angular `change-detection-eager`: added `ChangeDetectionStrategy.Eager` to example app components (preserves pre-v22 Default behavior).
- Angular `http-xhr-backend`: `provideLumberjackHttpDriver` now injects `withXhr()` into `provideHttpClient`.
- Angular `strict-safe-navigation-narrow`: extended diagnostics disabled in lib/app tsconfigs.
- Nx gitignore entries (claude worktrees, polygraph, self-healing, migrate-runs).
- TS6: `ignoreDeprecations: "6.0"` + pre-TS6 default pins on chain-root tsconfigs.
- ESLint: full conversion from `.eslintrc.json` → `eslint.config.mjs` (root + every project).

### Fallout fixes (manual)

**ESLint 9 / flat config was hard-required** by `@nx/eslint:update-23-1-0-convert-to-flat-config` (requires `eslint >= 9`). Flagged prominently per package non-goals contingency.

Incompatible plugins removed (no ESLint 9 release; they crash loading type-aware rules against typescript-eslint v8):

- `eslint-plugin-etc`
- `eslint-plugin-rxjs`
- `eslint-plugin-ordered-imports`

Retained explicitly-configured rules that still have a working host:

- `@typescript-eslint/prefer-readonly: error`
- `sonarjs/cognitive-complexity: [error, 8]` (via sonarjs 4.2.0)

Other fallout:

- Root flat config uses `projectService: true` so lint targets that run with `cwd` set to a project root still resolve type info.
- `@typescript-eslint/ban-types` eslint-disable comments → `@typescript-eslint/no-unsafe-function-type`.
- `@angular-eslint/prefer-on-push-component-change-detection` disabled (preset default; conflicts with Angular's Eager migration).
- `docusaurus.config.ts` ignored (not in any tsconfig; type-aware lint cannot load it).
- Unused `dirname`/`fileURLToPath` imports stripped from project eslint configs.
- Removed unused `@eslint/eslintrc` / `@eslint/js` after dropping FlatCompat.

AI prompt migrations applied by hand (agentic flow was disabled):

1. `convert-to-flat-config` — finished + made lint green.
2. `migrate-ban-types-rule` — no config entry referenced ban-types; only disable comments updated.
3. `verify-typecheck` — tests/builds green under TS6; no isolatedModules pin needed (TS >= 6).

## Files touched

**Root / workspace**

- `package.json`, `pnpm-lock.yaml`
- `nx.json`, `tsconfig.base.json`, `tools/tsconfig.tools.json`
- `.gitignore`, `.prettierignore`
- `eslint.config.mjs` (created); `.eslintrc.json`, `.eslintignore` (deleted)
- `tools/ai-migrations/**` (written by migrate; left in place)

**Per-project config**

- `**/eslint.config.mjs` under `packages/**` and `e2e/**` (created)
- `**/.eslintrc.json` under `packages/**` and `e2e/**` (deleted)
- `**/tsconfig.json`, `tsconfig.app.json`, `tsconfig.lib.json`, `tsconfig.lib.prod.json` (TS6 / Angular diagnostics)

**Source (migration + minimal fallout)**

- `packages/examples/lumberjack-app/src/app/app.component.ts`
- `packages/examples/lumberjack-app/src/app/nx-welcome.component.ts`
- `packages/ngworker/lumberjack/http-driver/src/lib/configuration/provide-lumberjack-http-driver.ts`
- `packages/ngworker/lumberjack/http-driver/src/lib/errors/lumberjack-http-driver.error.ts`
- `packages/ngworker/lumberjack/src/lib/logging/lumberjack.service.spec.ts`

**Not touched (as required)**

- `packages/ngworker/lumberjack/package.json` peerDependencies
- Docusaurus/React deps
- `.github/workflows/**`
- `.apnea/state.json`

## Verify transcript

### 1. `pnpm exec nx report` — exit 0

```
nx                     : 23.1.0
@nx/js                 : 23.1.0
@nx/eslint             : 23.1.0
@nx/workspace          : 23.1.0
@nx/angular            : 23.1.0
@nx/jest               : 23.1.0
@nx/cypress            : 23.1.0
@nx/devkit             : 23.1.0
@nx/eslint-plugin      : 23.1.0
typescript             : 6.0.3
Community plugins:
angular-eslint : 22.1.0
```

`@angular/core` (via package.json / installed): **22.0.7**

### 2. `pnpm run lint` — exit 0

```
NX   Successfully ran target lint for 7 projects
Cache: 7/7 hit (100%)
Run duration: 64ms
```

### 3. `pnpm run test` — exit 0

```
ngworker-lumberjack: 32 suites / 194 tests passed
internal-test-util: 3 suites / 48 tests passed
(+ examples-lumberjack-app, internal-console-driver-test-util)
NX   Successfully ran target test for 4 projects
```

### 4. `pnpm run build` — exit 0

```
Built @ngworker/lumberjack
Built @ngworker/lumberjack/console-driver
Built @ngworker/lumberjack/http-driver
→ dist/packages/ngworker/lumberjack/{console-driver,http-driver,fesm2022,types,package.json,README.md}
examples-lumberjack-app:build OK
docs-lumberjack-docs-app:build OK
NX   Successfully ran target build for 3 projects and 1 task they depend on
```

### 5. `pnpm exec nx format:check` — exit 0

```
format:check exit 0
```

### 6. `test ! -f migrations.json && echo "migrations.json removed"` — exit 0

```
migrations.json removed
```

## Residual risks

1. **ESLint 9 forced by Nx migration** — package non-goal preferred ESLint 8.57 + eslintrc; the convert-to-flat-config migration hard-requires ESLint ≥ 9, so the contingency path was taken. Flag for reviewers / later phases.
2. **Dropped ESLint plugins** with no ESLint 9 release:
   - `eslint-plugin-etc` (incl. `etc/no-commented-out-code`, `etc/no-const-enum`)
   - `eslint-plugin-rxjs` (entire recommended set)
   - `eslint-plugin-ordered-imports` (custom group-ordering)
     Consider replacing with ESLint-9-compatible alternatives in a later phase (`eslint-plugin-rxjs-x`, `eslint-plugin-perfectionist`, etc.).
3. **`withXhr()` always applied** inside `provideLumberjackHttpDriver` — Angular 22 migration. Consumers passing their own HttpClient features still get XHR; this is intentional to preserve pre-v22 default transport.
4. **`ChangeDetectionStrategy.Eager`** on example app components — Angular 22 migration output; equals former Default. Lint rule for OnPush intentionally disabled to keep migration fidelity.
5. **TypeScript 6.0.3** with `ignoreDeprecations: "6.0"` — defers deprecation cleanup (baseUrl, moduleResolution node, etc.) to a future TS7 migration.
6. **Peer deps still `^21.0.0`** — intentional (Phase 3). Library builds against Angular 22 but declares Angular 21 peers until the public breaking release.
7. **`tools/ai-migrations/`** left on disk (Nx wrote them). Safe to delete once review is done; not required at runtime.
8. Peer-dep warnings remain for transitive `@module-federation/*` (wants TS ≤ 5) and postcss version skew under `@nx/webpack` — pre-existing class of warnings, not blocking.
