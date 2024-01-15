---
title: 'Announcing Lumberjack v16: Life improvements, deprecations and an ambicius roadmap'
description: Lumberjack v16 is here, and we are happy to share everything that's new.
slug: announcing-lumberjack-v16
authors:
  - name: Nacho Vazquez
    title: NgWorker and core maintainer of Lumberjack
    url: https://github.com/NachoVazquez
    image_url: https://github.com/NachoVazquez.png
  - name: Lars Gyrup Brink Nielsen
    title: NgWorker and core maintainer of Lumberjack
    url: https://github.com/LayZeeDK
    image_url: https://github.com/LayZeeDK.png
tags: [announcement, lumberjack, v16]
image: https://pub-2294738bc2c249ff8040505bf960c018.r2.dev/logo.svg
hide_table_of_contents: false
---

We are back, bringing a new version of Lumberjack with deprecations, improvements, and a secret project.

**TL;DR** - Lumberjack version 16 introduces the following updates: new level-based logging methods for the Lumberjack service, alignment with Angular 16.2, deprecation of all Lumberjack NgModules, and the introduction of a new spin-off project.

## New level-based logging methods

In our constant intent to improve the developer experience, we have introduced new level-based logging methods for the Lumberjack service.

Previously, a single `log` method accepted a `LumberjackLog` object. This object contained the log message and the log level. We have now introduced a new method for each log level:

Previous:

```ts
// (...)
import { LumberjackService, LumberjackTimeService } from '@ngworker/lumberjack';

// (...)
export class MyComponent implements OnInit {
  readonly #lumberjack = inject(LumberjackService);
  readonly #time = inject(LumberjackTimeService);

  // (...)
  ngOnInit(): void {
    this.#lumberjack.log({
      level: LumberjackLevel.Info,
      message: 'Hello, World!',
      scope: 'MyComponent',
      createdAt: this.#time.getUnixEpochTicks(),
    });
  }
}
```

New:

```ts
// (...)
import { LumberjackService, LumberjackTimeService } from '@ngworker/lumberjack';

// (...)
export class MyComponent implements OnInit {
  readonly #lumberjack = inject(LumberjackService);
  readonly #time = inject(LumberjackTimeService);

  // (...)
  ngOnInit(): void {
    this.#lumberjack.logInfo('Hello, World!');
  }
}
```

This new API is courtesy of our new contributor, Pierre Bouillon. Thank you, Pierre!

## NgModule deprecation

At Lumberjack, we embrace the new standalone APIs as the best way to configure our libraries and applications. That's why we have decided to deprecate all Lumberjack NgModules.

NgModules will be available until Lumberjack v18. After that, we will remove them from the library.

As an additional benefit, after deleting the NgModules in version 18, we will receive a nice reduction in our bundle size.

We remove all usage of NgModule in our internal codebase and are happy with the result. We hope you will be too.

## Ambitious Secret Project

Since version 15, we have been playing with an idea: what if we could create the best framework agnostic logging library? For that, we created a [PR (now closed)](https://github.com/ngworker/lumberjack/pull/154) where we experimented with extracting the agnostic API of Lumberjack. There are also a few discussions that you can read [here](https://github.com/ngworker/lumberjack/discussions/166) and [here](https://github.com/ngworker/lumberjack/discussions/183).

However, we noticed that we were prisoners of our old API and wanted to try something new. That's why we decided to create a new spin-off project called LumberjackJS.

We will offer more information when we are ready, but we are excited about the future of this project.

The idea is to merge the two projects eventually and have a single library that can be used in any framework. But there is much work and experimentation to be done before that.

## Community

We are proud and thrilled to have [Pierre Bouillon](https://pbouillon.github.io) contributing to our project.

## DEV

Starting from this blog post, we will cross-post all our articles and release notes in our newly created [DEV organization](https://dev.to/lumberjack-js.)

Please give it a follow.

## Wrapping Up

Our goal for 2024 is to keep updating Lumberjack at the same rate as Angular. That's why we will release very shortly Lumberjack v17 with Angular 17 support.

The remaining of our efforts will be on improving the Lumberjack Developer experience and documentation. But the main chunk of our time will be spent on LumberjackJS.
