---
title: 'Announcing Lumberjack v15: A Step Forward'
description: Lumberjack v15 is here, and we are happy to share everything that's new.
slug: announcing-lumberjack-v15
authors:
  - name: Nacho Vazquez
    title: NgWorker and core maintainer of Lumberjack
    url: https://github.com/NachoVazquez
    image_url: https://github.com/NachoVazquez.png
  - name: Lars Gyrup Brink Nielsen
    title: NgWorker and core maintainer of Lumberjack
    url: https://github.com/LayZeeDK
    image_url: https://github.com/LayZeeDK.png
tags: [announcement, lumberjack, v15]
image: https://pub-2294738bc2c249ff8040505bf960c018.r2.dev/logo.svg
hide_table_of_contents: false
---

We are happy to announce that we've released @ngworker/lumberjack version 15. The team has been working on a group of updates that aim to improve the Lumberjack experience. Enough small talk; let's dive into what's new!

**TL;DR** - Lumberjack version 15 introduces the following updates: internal upgrades like using the latest type-safe `inject` function or migrating into EcmaScript private fields. Updates to Angular version 15, Nx version 16.3, and Node 18. The most significant announcements are that we've added support for standalone Angular applications; now, you can conveniently include Lumberjack in the `bootstrap application` function and configure Lumberjack drivers as needed. The cherry on top, we launched our docs website, where you are reading this blog post.

## Better Type Safety

We've introduced the newest type-safe `inject` function to Lumberjack's source code, moving away from constructor parameter decorators. This is a small step towards improving our source code's (already great) type safety and aligning our Angular implementations with current standards.

## Keeping up to date

We are all excited about everything that's happening in the JavaScript world. That's why we will continue putting efforts into keeping Lumberjack up to date with the latest version of Angular and any other tool that's part of the Lumberjack suite.

This time, we have updated to Angular version 15, Nx version 16.3, and Node 18. Please note this will introduce breaking changes.

> Please update to at least Angular 15 before upgrading Lumberjack.

We migrated our entire workspace from TypeScript private fields to EcmaScript private fields, and we set to true the `useDefineForClassFields` flag on our **tsconfig**. These changes should make Lumberjack source code future-proof and more aligned with the current standards.

## Supporting Standalone Angular Applications

Our most exciting announcement is that we've added support for standalone Angular applications. You can include Lumberjack directly in the `bootstrap application` function. Here's an example of how to use the new APIs:

```ts
bootstrapApplication(AppComponent, {
  providers: [
    // (…)
    provideLumberjack(),
    // (…)
  ],
});
```

### Enhanced Driver Configuration

We've also enabled you to enable the standalone providers for the out-of-the-box Lumberjack drivers. Here's how you can do it:

```ts
bootstrapApplication(AppComponent, {
  providers: [
    // (…)
    provideLumberjack(),
    provideLumberjackConsoleDriver(),
    provideLumberjackHttpDriver(withHttpConfig({…})),
    // (…)
  ],
});
```

### Advanced Configuration for Those Who Want More

Configuring `Lumberjack` and the `ConsoleDriver` with the new API should represent a similar experience to what we have been able to do before with Modules.

We can configure both `Lumberjack` and the `ConsoleDriver` without any extra arguments or by passing a configuration object as the single parameter of the provided functions.

```ts
bootstrapApplication(AppComponent, {
  providers: [
    provideLumberjack({ levels: [LumberjackLevel.Error] }),
    provideLumberjackConsoleDriver({
      levels: [LumberjackLevel.Info, LumberjackLevel.Error],
    }),
  ],
});
```

The `HttpDriver` is slightly more advanced since now we need to use the `with*` config functions for the different configuration types.

We can use the `withHttpOptions.`

```ts
bootstrapApplication(AppComponent, {
  providers: [
    provideLumberjack(),
    provideLumberjackHttpDriver(
      withHttpOptions({
        origin: 'ForestApp',
        retryOptions: { maxRetries: 1, delayMs: 250 },
        storeUrl: '/API/logs',
      }),
    ),
```

Or the `withHttpConfig`

```ts
bootstrapApplication(AppComponent, {
  providers: [
    provideLumberjack(),
    provideLumberjackHttpDriver(
      withHttpConfig({
        levels: [LumberjackLevel.Error],
        origin: 'ForestApp',
        retryOptions: { maxRetries: 1, delayMs: 250 },
        storeUrl: '/API/logs',
      }),
    ),
```

The big novelty is that now, we can also configure the underlying `HttpClient` using the second argument of the `provideLumberjackHttpDriver` function.

```ts
bootstrapApplication(AppComponent, {
  providers: [
    provideLumberjack(),
    provideLumberjackHttpDriver(
      withHttpConfig({
        levels: [LumberjackLevel.Error],
        origin: 'ForestApp',
        retryOptions: { maxRetries: 1, delayMs: 250 },
        storeUrl: '/API/logs',
      }),
      withInterceptors([
        (req, next) => {
          const easy = inject(easyToken);
          console.log('are interceptors working?', easy);
          return next(req);
        },
      ])
    ),
```

### Continuouing Module Support

We want to assure you that we continue to support modules. The new standalone APIs are a complement, not a replacement. Choose your poison.

## New Docs website

And the cherry on top is…

We are launching our dedicated documentation website. A dedicated website should make our documentation more accessible for our users and easier to update for our contributors.

This will be the home of future announcements and articles about the Lumberjack ecosystem.

## Wrapping Up

We hope these changes will help your logging journey better and safer. We're grateful for your support, and as always, happy coding!
