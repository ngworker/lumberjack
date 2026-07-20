---
status: done
---

# Coder result — Phase 3: Breaking-change release surface for @ngworker/lumberjack v22

## What changed

Two surgical source edits; no library source, root deps, or version hand-bumps.

1. **Peers** in `packages/ngworker/lumberjack/package.json`:

   - `@angular/core`: `^21.0.0` → `^22.0.0`
   - `@angular/common`: `^21.0.0` → `^22.0.0`
   - `rxjs` range, `peerDependenciesMeta`, `dependencies`, and `version: 21.0.1` left unchanged.

2. **Compatibility table** in `packages/docs/lumberjack-docs-app/docs/compatibility.md`:
   - Added top row `| 22.x | 22.x |`; all prior rows retained.

Rebuild of `ngworker-lumberjack` wrote the new peers into dist; secondary entry points and `exports` map verified.

## Files touched

- `packages/ngworker/lumberjack/package.json` (two peer ranges only)
- `packages/docs/lumberjack-docs-app/docs/compatibility.md` (one table row)

## Verify transcript

### 1. `pnpm exec nx build ngworker-lumberjack` — exit 0

```
Built @ngworker/lumberjack
Built @ngworker/lumberjack/console-driver
Built @ngworker/lumberjack/http-driver
→ dist/packages/ngworker/lumberjack
✔ dist/packages/ngworker/lumberjack/README.md
NX   Successfully ran target build for project ngworker-lumberjack
Run duration: 3.6s
```

### 2. Dist peers check — exit 0

```sh
node -e "const p=require('./dist/packages/ngworker/lumberjack/package.json'); ..."
```

```
21.0.1 {"@angular/core":"^22.0.0","@angular/common":"^22.0.0","rxjs":">= 7.8.1 < 8.0.0"}
peerDependenciesMeta {"@angular/common":{"optional":true},"rxjs":{"optional":true}}
version 21.0.1
```

### 3. Dist exports / entry-point dirs — exit 0

```
exports ok [ './package.json', '.', './console-driver', './http-driver' ]
entry point dirs ok
# console-driver/ and http-driver/ each contain package.json + README.md
# root README.md present
```

### 4. Compatibility row — exit 0

```
10:| 22.x            | 22.x               |
```

### 5. `pnpm run lint` — exit 0

```
NX   Successfully ran target lint for 7 projects
Run duration: 8.2s
```

### 6. `pnpm run test` — exit 0

```
NX   Successfully ran target test for 4 projects
Run duration: 5.1s
```

### 7. `pnpm run build` — exit 0

```
NX   Successfully ran target build for 3 projects and 1 task they depend on
Run duration: 9.6s
```

## Release convention (for run terminus / PR merge)

> The merge to `main` for this run must land as a conventional **breaking** commit, e.g. title `feat!: require Angular 22` with footer `BREAKING CHANGE: @ngworker/lumberjack now requires @angular/core >= 22 and @angular/common >= 22 as peer dependencies.` This is what makes `nx release version` compute 22.0.0 from 21.0.1. A plain `feat:` would incorrectly produce 21.1.0.

## Residual risks

1. **Package `version` still `21.0.1`** in source and dist — intentional; only `nx release` should bump to 22.0.0 via the breaking commit convention above.
2. **No publish/tag/release run** — Phase 4 / out-of-band. Peers are ready; release pipeline not exercised here.
3. **No root lockfile change** — peers only; consumers resolve Angular 22 themselves. Workspace already runs Angular 22.0.7 from Phase 1.
4. **Docs content only** — compatibility table updated; no README/project.md claims added (none existed).
