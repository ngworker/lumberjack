---
title: Installation
description: How to install @ngworker/lumberjack with pnpm, npm, or yarn.
---

Add the package to your Angular application. Secondary entry points
(`console-driver`, `http-driver`) ship in the same package — no extra installs.

## Install

```sh
pnpm add @ngworker/lumberjack
```

| Toolchain | Command |
| --------- | ------- |
| pnpm | `pnpm add @ngworker/lumberjack` |
| npm | `npm install @ngworker/lumberjack` |
| yarn | `yarn add @ngworker/lumberjack` |

## Peer dependency

Lumberjack 22 requires `@angular/core` **^22.0.0**. Match major versions using
the [compatibility table](/lumberjack/getting-started/compatibility/).

## Next steps

- [Quick start](/lumberjack/getting-started/quick-start/) — register and log
- [Configure Lumberjack](/lumberjack/guides/configure-lumberjack/)
