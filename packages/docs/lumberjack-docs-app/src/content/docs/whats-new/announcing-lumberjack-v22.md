---
title: 'Announcing Lumberjack v22: Angular 22'
description: Lumberjack v22 is here and it brings compatibility with Angular 22.
---

Lumberjack v22 is out, bringing compatibility with Angular 22.

## Angular 22

With the new version of Angular out, we are happy to announce that Lumberjack is compatible with Angular 22.

## Breaking changes

- Peer dependencies now require `@angular/core` and `@angular/common` `^22.0.0`. Upgrade Angular before (or together with) Lumberjack.

## What's New

- Updated peer dependencies to Angular 22
- Updated the workspace to Nx 23.1.0 and TypeScript 6.0.3
- Migrated the monorepo lint stack to ESLint 9 flat config

## Notes for upgraders

Angular 22 defaults `HttpClient` to the fetch backend. Lumberjack's HTTP driver continues to accept the same `provideHttpClient(...)` features as before, so you can pass `withXhr()` (or any other feature) when you call `provideLumberjackHttpDriver` if your app still needs XHR.

See the [compatibility table](/lumberjack/getting-started/compatibility/) for the full Angular ↔ Lumberjack matrix.

## Wrapping Up

This was a short one; update your dependencies and enjoy the new version of Lumberjack.
