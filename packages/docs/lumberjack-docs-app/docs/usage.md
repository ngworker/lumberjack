---
sidebar_position: 3
title: Usage
---

> For a complete walkthrough video please
> visit [@ngworker/lumberjack v2 - Show & Tell BLS024](https://youtu.be/OV1ONtLAJnI)

To register Lumberjack, add `LumberjackModule.forRoot()` to your root or core Angular module.

> Note: Lumberjack NgModules are deprecated and will be removed in version 18. Use the Standalone API, provider functions, instead.

```ts
// (...)
import {LumberjackModule} from '@ngworker/lumberjack';

@NgModule({
  imports: [
    // (...)
    LumberjackModule.forRoot(),
    // (...)
  ],
  // (...)
})
```

Or if you prefer a prefer standalone approach using the `provideLumberjack()`.

```ts
bootstrapApplication(AppComponent, {
  providers: [
    // (...)
    provideLumberjack(),
    // (...)
  ],
});
```

You must also register the log driver modules for the log drivers that you want to enable.

If you want to add the `LumberjackHttpDriver` and the `LumberjackConsoleDriver`, add the following code

> Note: Lumberjack NgModules are deprecated and will be removed in version 18. Use the Standalone API, provider functions, instead.

```ts
// (...)
import { LumberjackModule } from '@ngworker/lumberjack';
import { LumberjackHttpDriverModule } from '@ngworker/lumberjack/http-driver';
import { LumberjackConsoleDriverModule } from '@ngworker/lumberjack/console-driver';

@NgModule({
  imports: [
    // (...)
    LumberjackModule.forRoot(),
    LumberjackConsoleDriverModule.forRoot(),
    LumberjackHttpDriverModule.withOptions({
      origin: '<app-name>',
      storeUrl: '/api/logs',
      retryOptions: { maxRetries: 5, delayMs: 250 },
    }),
    // (...)
  ],
  // (...)
})
export class AppModule {}
```

Or using the standalone version

```ts
bootstrapApplication(AppComponent, {
  providers: [
    // (...)
    provideLumberjack(),
    provideLumberjackConsoleDriver(),
    provideLumberjackHttpDriver(withHttpConfig({...})),
    // (...)
  ],
});
```

### Using the `LumberjackService`

For quick or simple use cases, you can use the `LumberjackService` directly by passing logs to its `log` method.
However, we recommend implementing application-specific logger services instead. See the [_Best
practices_](./best-practices) section.

First, inject the `LumberjackService` where you want to use it.

```ts
import { Component } from '@angular/core';
import { LumberjackService } from '@ngworker/lumberjack';

@Component({
  // (...)
})
export class MyComponent implements OnInit {
  constructor(private readonly lumberjack: LumberjackService) {}

  // (...)
}
```

or using the `inject` function

```ts
import { inject, Component } from '@angular/core';
import { LumberjackService } from '@ngworker/lumberjack';

@Component({
  // (...)
})
export class MyComponent implements OnInit {
  readonly #lumberjack = inject(LumberjackService);
  // (...)
}
```

Then we can start logging. However, you'll also want to inject `LumberjackTimeService` to maintain a high level of
testability.

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
      level: 'info',
      message: 'Hello, World!',
      scope: 'MyComponent',
      createdAt: this.#time.getUnixEpochTicks(),
    });
  }
}
```

Alternatively, you can also use the shorthand version:

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

> Each log level has its associated shorthand version: `'info'` is `logInfo`, `'debug'` is `logDebug`, etc.

### LumberjackModule and provideLumberjack

Optionally, we can pass one or more options to `LumberjackModule.forRoot` or to the `provideLumberjack` function.

| Option   | Type                           | Optional? | Description                                                          |
| -------- | ------------------------------ | --------- | -------------------------------------------------------------------- |
| `format` | (log: LumberjackLog) => string | Yes       | Pass a custom formatter to transform a log into a log message.       |
| `levels` | `LumberjackConfigLevels`       | Yes       | The root log levels defining the default log levels for log drivers. |

### Default options

Lumberjack's configuration is flexible. We can provide a full configuration object, a partial option set, or no options
at all.

Lumberjack replaces omitted options with defaults.

When the `format` option is not configured, Lumberjack will use the following default formatter.

```ts
function lumberjackFormatLog({ scope, createdAt: timestamp, level, message }: LumberjackLog) {
  return `${level} ${utcTimestampFor(timestamp)}${scope ? ` [${scope}]` : ''} ${message}`;
}
```

Where `utcTimestampFor` is a function that converts Unix Epoch ticks to UTC 0 hours offset with milliseconds resolution.

#### Default log levels

When the `levels` setting is not configured, log levels are configured depending on whether our application runs in
development mode or production mode.

By default, in development mode, **all** log levels are enabled.

By default, in production mode, the following log levels are enabled:

- Critical
- Error
- Info
- Warning
