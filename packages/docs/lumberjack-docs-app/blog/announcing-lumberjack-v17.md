---
title: 'Announcing Lumberjack v17: Literal Union Levels, Angular 17 and a new Contributor'
description: Lumberjack v17 is on as promised, here is what's new.
slug: announcing-lumberjack-v17
authors:
  - name: Nacho Vazquez
    title: NgWorker and core maintainer of Lumberjack
    url: https://github.com/NachoVazquez
    image_url: https://github.com/NachoVazquez.png
tags: [announcement, lumberjack, v16]
image: https://pub-2294738bc2c249ff8040505bf960c018.r2.dev/logo.svg
hide_table_of_contents: false
---

As promised, we are getting up to speed with Angular versions. We are happy to announce that Lumberjack v17 is here.

**TL;DR** - Lumberjack version 17 introduces the following: Support for string literal unions as log levels, deprecation of enum-based log levels, alignment with Angular 17 upgrading to the latest Nx, and a special new contributor.

## String Literal Unions Log Levels

In our continued pursuit of DX happiness, we are happy to introduce string literal unions as log levels.

String literal unions are less verbose than enums, and since they don't have a runtime implementation, they also make our bundle size lighter.

The new log levels are:

```ts
export type Level = 'critical' | 'debug' | 'error' | 'info' | 'trace' | 'verbose' | 'warn';
```

You can use the new API anywhere you were using the enum-based log levels:

Before:

```ts
this.#lumberjack.log({
  level: LumberjackLevel.Info,
  message: 'Hello, World!',
  scope: 'MyComponent',
  createdAt: this.#time.getUnixEpochTicks(),
});
```

Now:

```ts
this.#lumberjack.log({
  level: 'info',
  message: 'Hello, World!',
  scope: 'MyComponent',
  createdAt: this.#time.getUnixEpochTicks(),
});
```

## Enum-based Log levels deprecation

As part of the introduction to string literal unions, we are deprecating the enum-based log levels.

Once removed in version 19, we can reduce the bundle size and simplify the API.

## Community

On this version, we had the star collaboration of [Diego Julião](https://github.com/dianjuar) core maintainer of [ngx-deploy-npm](https://github.com/bikecoders/ngx-deploy-npm).

Diego helped us upgrade our deployment process to use the latest version of `ngx-deploy-npm`.

Thanks, Diego!

## Wrapping Up

That's it, folks. Last time, we promised to release a new version of Lumberjack quickly, and we did it. We are happy to be able to keep our promises. Now that we are up to date with Angular, you should expect more news on our [secret project](https://ngworker.github.io/lumberjack/blog/announcing-lumberjack-v16/#ambitious-secret-project) soon
