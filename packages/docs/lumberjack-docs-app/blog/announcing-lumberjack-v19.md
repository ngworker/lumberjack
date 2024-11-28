---
title: 'Announcing Lumberjack v19: Angular 19 and no more Enum-based levels'
description: Lumberjack v19 is here and it brings compatibility with Angular 19 and removes the old and depricated Enum-based levels.
slug: announcing-lumberjack-v19
authors:
  - name: Nacho Vazquez
    title: NgWorker and core maintainer of Lumberjack
    url: https://github.com/NachoVazquez
    image_url: https://github.com/NachoVazquez.png
tags: [announcement, lumberjack, v19]
image: https://pub-2294738bc2c249ff8040505bf960c018.r2.dev/logo.svg
hide_table_of_contents: false
---

It took us a couple of months, but here we are. Lumberjack v19 is out, which brings compatibility with Angular 19 and removes the old and depricated Enum-based levels.

## Angular 19

With the new version of Angular out, we are happy to announce that Lumberjack is compatible with Angular 19.

This closes issue: [#213](https://github.com/ngworker/lumberjack/issues/213)

## Enum-based levels removal

In version 17, we deprecated the usage of Enum-based levels in favor of string literal unions and announced they would be removed in version 19. See [here](https://ngworker.github.io/lumberjack/blog/announcing-lumberjack-v17). Mission accomplished.

This change simplifies the API and reduces the library bundle size.

## Wrapping Up

There is nothing else to add; update your dependencies and enjoy the new version of Lumberjack.
