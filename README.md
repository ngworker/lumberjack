> Chop and cut Angular logs like a professional lumberjack.

<p align="center">
 <img width="40%" height="40%" src="https://pub-2294738bc2c249ff8040505bf960c018.r2.dev/logo.svg">
</p>

[Logo by Felipe Zambrano](http://instagram.com/octopez)

<br />

[![MIT](https://img.shields.io/packagist/l/doctrine/orm.svg?style=flat-square)]()
[![commitizen](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)]()
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)]()
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![All Contributors](https://img.shields.io/badge/all_contributors-7-orange.svg?style=flat-square)](#contributors-)
[![ngworker](https://img.shields.io/badge/ngworker-%40-red)](https://github.com/ngworker/)
[![Wallaby.js](https://img.shields.io/badge/wallaby.js-powered-blue.svg?style=flat&logo=github)](https://wallabyjs.com/oss/)

[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=ngworker_lumberjack&metric=ncloc)](https://sonarcloud.io/dashboard?id=ngworker_lumberjack)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=ngworker_lumberjack&metric=coverage)](https://sonarcloud.io/dashboard?id=ngworker_lumberjack)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=ngworker_lumberjack&metric=duplicated_lines_density)](https://sonarcloud.io/dashboard?id=ngworker_lumberjack)  
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ngworker_lumberjack&metric=alert_status)](https://sonarcloud.io/dashboard?id=ngworker_lumberjack)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=ngworker_lumberjack&metric=security_rating)](https://sonarcloud.io/dashboard?id=ngworker_lumberjack)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=ngworker_lumberjack&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=ngworker_lumberjack)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=ngworker_lumberjack&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=ngworker_lumberjack)

Lumberjack is a versatile Angular logging library, specifically designed to be extended and customized. It provides a
few simple [log drivers](https://en.wikipedia.org/wiki/Log_driving) (logging mechanisms, transports, log drivers)
out-of-the-box. It's easy to enable the built-in log drivers or create and use custom log drivers.

> For support, please refer to the `#lumberjack` channel in [the Angular Discord server](http://discord.gg/angular).

## Features

- ✅ Configurable multilevel logging
- ✅ Plugin-based log driver architecture
- ✅ Robust error handling
- ✅ Console driver
- ✅ HTTP driver
- ✅ Logger base class
- ✅ Lumberjack service
- ✅ Best practices guide

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Log drivers](#log-drivers)
- [Community Drivers](#community-drivers)
- [Best practices](#best-practices)
- [Wallaby.js](#wallaby.js)
- [Contributors](#contributors)

## Installation

Lumberjack is published as the `@ngworker/lumberjack` package.

| Toolchain | Command                            |
| --------- | ---------------------------------- |
| NPM CLI   | `npm install @ngworker/lumberjack` |
| PNPM CLI  | `pnpm add @ngworker/lumberjack`    |
| Yarn CLI  | `yarn add @ngworker/lumberjack`    |

## Compatibility

Refer to the following table to determine which version of Lumberjack is compatible with your Angular version.

| Angular version | Lumberjack version |
| --------------- | ------------------ |
| 15.x            | 15.x               |
| 14.x            | 14.x               |
| 13.x            | 2.x                |
| 12.x            | 2.x                |
| 11.x            | 2.x                |
| 10.x            | 2.x                |
| 9.x             | 2.x                |

## Usage

> For a complete walkthrough video please
> visit [@ngworker/lumberjack v2 - Show & Tell BLS024](https://youtu.be/OV1ONtLAJnI)

To register Lumberjack, add `LumberjackModule.forRoot()` to your root or core Angular module.

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

Or if you prefer a prefer Module-less approach using the `provideLumberjack()`.

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

Or using the Module-less version

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

</br>

### Using the `LumberjackService`

For quick or simple use cases, you can use the `LumberjackService` directly by passing logs to its `log` method.
However, we recommend implementing application-specific logger services instead. See the [_Best
practices_](#best-practices) section.

First, inject the `LumberjackService` where you want to use it.

```ts
import { Component } from '@angular/core';
import { LumberjackService } from '@ngworker/lumberjack';

@Component({
  // (...)
})
export class MyComponent implements OnInit {
  constructor(private lumberjack: LumberjackService) {}

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
  private readonly lumberjack = inject(LumberjackService);
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
  private readonly lumberjack = inject(LumberjackService);
  private readonly time = inject(LumberjackTimeService);

  // (...)
  ngOnInit(): void {
    this.lumberjack.log({
      level: LumberjackLevel.Info,
      message: 'Hello, World!',
      scope: 'MyComponent',
      createdAt: this.time.getUnixEpochTicks(),
    });
  }
}
```

### LumberjackModule and provideLumberjack

Optionally, we can pass one or more options to `LumberjackModule.forRoot` or to the `provideLumberjack` function.

| Option   | Type                           | Optional? | Description                                                          |
| -------- | ------------------------------ | --------- | -------------------------------------------------------------------- |
| `format` | (log: LumberjackLog) => string | Yes       | Pass a custom formatter to transform a log into a log message.       |
| `levels` | `LumberjackConfigLevels`       | Yes       | The root log levels defining the default log levels for log drivers. |

</br>

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

</br>

## Log drivers

Earlier, we briefly introduced the term _log driver_. This section explains in depth how to use and configure them and
how to create custom log drivers.

A log driver is the conduit used by the Lumberjack to output or persist application logs.

Lumberjack offers basic log drivers out-of-the-box, namely the `LumberjackConsoleDriver` and the `LumberjackHttpDriver`.

Every log driver implements the `LumberjackLogDriver` interface.

```ts
export interface LumberjackLogDriver<TPayload extends LumberjackLogPayload | void = void> {
  readonly config: LumberjackLogDriverConfig;

  logCritical(driverLog: LumberjackLogDriverLog<TPayload>): void;

  logDebug(driverLog: LumberjackLogDriverLog<TPayload>): void;

  logError(driverLog: LumberjackLogDriverLog<TPayload>): void;

  logInfo(driverLog: LumberjackLogDriverLog<TPayload>): void;

  logTrace(driverLog: LumberjackLogDriverLog<TPayload>): void;

  logWarning(driverLog: LumberjackLogDriverLog<TPayload>): void;
}
```

The `LumberjackLogDriverLog` holds a formatted string representation of the `LumberjackLog` and the `LumberjackLog`
itself.

```ts
export interface LumberjackLogDriverLog<TPayload extends LumberjackLogPayload | void = void> {
  readonly formattedLog: string;
  readonly log: LumberjackLog<TPayload>;
}
```

### Log levels

Log drivers should make it possible to configure the logging levels on a per driver basis.

For example, we could use the default logging levels for the console driver, but only enable the critical and error
levels for the HTTP driver as seen in the following example.

```ts
import { NgModule } from '@angular/core';
import { LumberjackLevel, LumberjackModule } from '@ngworker/lumberjack';
import { LumberjackConsoleDriverModule } from '@ngworker/lumberjack/console-driver';
import { LumberjackHttpDriverModule } from '@ngworker/lumberjack/http-driver';

@NgModule({
  imports: [
    LumberjackModule.forRoot({
      levels: [LumberjackLevel.Verbose],
    }),
    LumberjackConsoleDriverModule.forRoot(),
    LumberjackHttpDriverModule.forRoot({
      levels: [LumberjackLevel.Critical, LumberjackLevel.Error],
      origin: 'ForestApp',
      storeUrl: '/api/logs',
      retryOptions: { maxRetries: 5, delayMs: 250 },
    }),
    // (...)
  ],
  // (...)
})
export class AppModule {}
```

Or use the Module-less version of the API

```ts
import { bootstrapApplication } from '@angular/platform-browser';

import { LumberjackLevel, provideLumberjack } from '@ngworker/lumberjack';
import { provideLumberjackConsoleDriver } from '@ngworker/lumberjack/console-driver';
import { provideLumberjackHttpDriver, withHttpConfig } from '@ngworker/lumberjack/http-driver';

import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideLumberjack(),
    provideLumberjackConsoleDriver(),
    provideLumberjackHttpDriver(
      withHttpConfig({
        levels: [LumberjackLevel.Critical, LumberjackLevel.Error],
        origin: 'ForestApp',
        storeUrl: '/api/logs',
        retryOptions: { maxRetries: 5, delayMs: 250 },
      })
    ),
  ],
});
```

### Creating a custom log driver

> Note, you can use
> the [ngworker/lumberjack-custom-driver](https://github.com/ngworker/lumberjack-custom-driver/generate) template Git
> repository to start a separate Lumberjack log driver workspace.

Let's create a simple log driver for the browser console.

```ts
import { inject, Injectable } from '@angular/core';

import { LumberjackLogDriver, LumberjackLogDriverConfig, LumberjackLogDriverLog } from '@ngworker/lumberjack';

import { consoleDriverConfigToken } from './console-driver-config.token';

@Injectable()
export class ConsoleDriver implements LumberjackLogDriver {
  readonly config = inject(consoleDriverConfigToken);

  logCritical({ formattedLog }: LumberjackLogDriverLog): void {
    console.error(formattedLog);
  }

  logDebug({ formattedLog }: LumberjackLogDriverLog): void {
    console.debug(formattedLog);
  }

  logError({ formattedLog }: LumberjackLogDriverLog): void {
    console.error(formattedLog);
  }

  logInfo({ formattedLog }: LumberjackLogDriverLog): void {
    console.info(formattedLog);
  }

  logTrace({ formattedLog }: LumberjackLogDriverLog): void {
    console.trace(formattedLog);
  }

  logWarning({ formattedLog }: LumberjackLogDriverLog): void {
    console.warn(formattedLog);
  }
}
```

In the above snippet, the config is injected and assigned to the public `config` property. Lumberjack uses this
configuration to determine which logs the log driver should handle.

#### Using a LumberjackLogPayload

We might want to add some extra data not present in the `LumberjackLog` to our log driver.

For such cases, Lumberjack exposes the `LumberjackLog#payload` property.

```ts
/**
 * A Lumberjack log entry
 */
export interface LumberjackLog<TPayload extends LumberjackLogPayload | void = void> {
  /**
   * Scope, for example domain, application, component, or service.
   */
  readonly scope?: string;
  /**
   * Unix epoch ticks (milliseconds) timestamp when log entry was created.
   */
  readonly createdAt: number;
  /**
   * Level of severity.
   */
  readonly level: LumberjackLogLevel;
  /**
   * Log message, for example describing an event that happened.
   */
  readonly message: string;

  /**
   * Holds any payload info
   */
  readonly payload?: TPayload;
}
```

We can modify the `ConsoleDriver` to handle such payload information

```ts
import { inject, Injectable } from '@angular/core';

import {
  LumberjackLogDriver,
  LumberjackLogDriverConfig,
  LumberjackLogDriverLog,
  LumberjackLogPayload,
} from '@ngworker/lumberjack';

import { consoleDriverConfigToken } from './console-driver-config.token';

export interface AnalyticsPayload extends LumberjackLogPayload {
  angularVersion: string;
}

@Injectable()
export class ConsoleDriver implements LumberjackLogDriver<AnalyticsPayload> {
  readonly config = inject(consoleDriverConfigToken);

  logCritical({ formattedLog, log }: LumberjackLogDriverLog<AnalyticsPayload>): void {
    console.error(formattedLog, log.payload);
  }

  logDebug({ formattedLog, log }: LumberjackLogDriverLog<AnalyticsPayload>): void {
    console.debug(formattedLog, log.payload);
  }

  logError({ formattedLog, log }: LumberjackLogDriverLog<AnalyticsPayload>): void {
    console.error(formattedLog, log.payload);
  }

  logInfo({ formattedLog, log }: LumberjackLogDriverLog<AnalyticsPayload>): void {
    console.info(formattedLog, log.payload);
  }

  logTrace({ formattedLog, log }: LumberjackLogDriverLog<AnalyticsPayload>): void {
    console.trace(formattedLog, log.payload);
  }

  logWarning({ formattedLog, log }: LumberjackLogDriverLog<AnalyticsPayload>): void {
    console.warn(formattedLog, log.payload);
  }
}
```

#### Creating a custom log driver module and provider functions

The provide functions provides configuration and other dependencies to a log driver. It also provides the log driver,
making
it available to Lumberjack.

```ts
import { Provider } from '@angular/core';

import {
  LumberjackLogDriverConfig,
  lumberjackLogDriverConfigToken,
  lumberjackLogDriverToken,
} from '@ngworker/lumberjack';

import { LumberjackConsoleDriver } from '../log-drivers/lumberjack-console.driver';

import { lumberjackConsoleDriverConfigToken } from './lumberjack-console-driver-config.token';
import { LumberjackConsoleDriverConfig } from './lumberjack-console-driver.config';

export function provideLumberjackConsoleDriver(config: Partial<LumberjackConsoleDriverConfig> = {}): Provider[] {
  return [
    {
      provide: lumberjackConsoleDriverConfigToken,
      deps: [lumberjackLogDriverConfigToken],
      useFactory: (logDriverConfig: LumberjackLogDriverConfig): LumberjackConsoleDriverConfig => ({
        ...logDriverConfig,
        identifier: LumberjackConsoleDriver.driverIdentifier,
        ...config,
      }),
    },
    {
      provide: lumberjackLogDriverToken,
      useClass: LumberjackConsoleDriver,
      multi: true,
    },
  ];
}
```

The driver module then acts as a wrapper for the log driver and the provide function.

```ts
import { ModuleWithProviders, NgModule } from '@angular/core';

import { LumberjackConsoleDriverRootModule } from './lumberjack-console-driver-root.module';
import { LumberjackConsoleDriverConfig } from './lumberjack-console-driver.config';
import { provideLumberjackConsoleDriver } from './lumberjack-console-driver.providers';

@NgModule()
export class LumberjackConsoleDriverModule {
  static forRoot(
    config: Partial<LumberjackConsoleDriverConfig> = {}
  ): ModuleWithProviders<LumberjackConsoleDriverRootModule> {
    return {
      ngModule: LumberjackConsoleDriverRootModule,
      providers: [provideLumberjackConsoleDriver(config)],
    };
  }

  constructor() {
    throw new Error('Do not import LumberjackConsoleDriverModule directly. Use LumberjackConsoleDriverModule.forRoot.');
  }
}
```

The static `forRoot()` method provides the `consoleDriverConfigToken`.

If no configuration is passed, then the root `LogDriverConfig` is used.

```ts
import { InjectionToken } from '@angular/core';
import { LumberjackLogDriverConfig, lumberjackLogDriverConfigToken } from '@ngworker/lumberjack';

export const consoleDriverConfigToken = new InjectionToken<LumberjackLogDriverConfig>('__CONSOLE_DRIVER_CONFIG__', {
  factory: () => inject({ ...lumberjackLogDriverConfigToken, identifier: 'ConsoleDriver' }),
});
```

This is possible because the `ConsoleDriver` has the same configuration options as the `LumberjackLogDriverConfig`. We
only have to include the driver identifier since it cannot be predefined.

For adding custom settings,
see [LumberjackHttpDriver](https://github.com/ngworker/lumberjack/blob/main/packages/ngworker/lumberjack/http-driver/src/lib/lumberjack-http-driver-root.module.ts).

The most important thing about the `LumberjackConsoleDriverModule` is that it provides the `LumberjackConsoleDriver`
using the `lumberjackLogDriverToken` with the `multi` flag on. This allows us to provide multiple log drivers for
Lumberjack at the same time.

#### Using a custom log driver

The last step is to import this module at the root module of our application, as seen in the first [_Usage_](#usage)
section.

```ts
@NgModule({
  imports: [
    LumberjackModule.forRoot(),
    ConsoleDriverModule.forRoot(),
    // (...)
  ],
  // (...)
})
export class AppModule {}
```

Or using the Module-less API.

```typescript
import { bootstrapApplication } from '@angular/platform-browser';

import { LumberjackLog, LumberjackOptions, provideLumberjack } from '@ngworker/lumberjack';
import { provideLumberjackConsoleDriver } from '@ngworker/lumberjack/console-driver';

import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideLumberjack(),
    provideLumberjackConsoleDriver(),
    // (...)
  ],
});
```

### HTTP driver

For a more advanced log driver implementation,
see [LumberjackHttpDriver](https://github.com/ngworker/lumberjack/blob/main/packages/ngworker/lumberjack/http-driver/README.md)

## Community drivers

> Note, you can use
> the [ngworker/lumberjack-custom-driver](https://github.com/ngworker/lumberjack-custom-driver/generate) template Git
> repository to start a separate Lumberjack log driver workspace.

If you want your driver listed here, open a PR and follow the same format.

- [@ngworker/lumberjack-firestore-driver](https://github.com/marcinmilewicz/lumberjack-firestore-driver), community log
  driver using [Cloud Firestore](https://firebase.google.com/docs/firestore) as a log store.
- [@ngworker/lumberjack-applicationinsights-driver](https://github.com/ngworker/lumberjack-applicationinsights-driver),
  community log driver
  using [Azure Application Insights](https://docs.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview) as
  a log store.

The ngworkers teams offers hosting of a community log driver in the [ngworker GitHub](https://github.com/ngworker)
and [@ngworker NPM](https://www.npmjs.com/org/ngworker) organizations.

## Best practices

Every log can be represented as a combination of its level, creation time, message, scope and payload. Using inline logs
with the `LumberjackService` can cause structure duplication and/or denormalization.

Continue reading to know more about the recommended best practices designed to tackle this issue.

### Loggers

The `LumberjackLogger` service is an abstract class that wraps the `LumberjackService` to help us create structured logs
and reduce boilerplate. At the same time, it provides testing capabilities since we can easily spy on logger methods and
control timestamps by replacing the `LumberjackTimeService`.

`LumberjackLogger` is used as the base class for any other logger that we need.

This is the abstract interface of `LumberjackLogger`:

```ts
/**
 * A logger holds methods that log a predefined log.
 *
 * Implement application- and library-specific loggers by extending this base
 * class. Optionally supports a log payload.
 *
 * Each protected method on this base class returns a logger builder.
 */
@Injectable()
export abstract class LumberjackLogger<TPayload extends LumberjackLogPayload | void = void> {
    protected lumberjack: LumberjackService<TPayload>;
    protected time: LumberjackTimeService;

    /**
     * Create a logger builder for a critical log with the specified message.
     */
    protected createCriticalLogger(message: string): LumberjackLoggerBuilder<TPayload>;

    /**
     * Create a logger builder for a debug log with the specified message.
     */
    protected createDebugLogger(message: string): LumberjackLoggerBuilder<TPayload>;

    /**
     * Create a logger builder for an error log with the specified message.
     */
    protected createErrorLogger(message: string): LumberjackLoggerBuilder<TPayload>;

    /**
     * Create a logger builder for an info log with the specified message.
     */
    protected createInfoLogger(message: string): LumberjackLoggerBuilder<TPayload>;

    /**
     * Create a logger builder for a trace log with the specified message.
     */
    protected createTraceLogger(message: string): LumberjackLoggerBuilder<TPayload>;

    /**
     * Create a logger builder for a warning log with the specified message.
     */
    protected createWarningLogger(message: string): LumberjackLoggerBuilder<TPayload>;

    /**
     * Create a logger builder for a log with the specified log level and message.
     */
    protected createLoggerBuilder(level: LumberjackLogLevel, message: string): LumberjackLoggerBuilder<TPayload>;
```

By extending `LumberjackLogger`, we only have to worry about our pre-defined logs' message and scope.

All logger factory methods are protected as it is recommended to create a custom logger per _scope_ rather than using
logger factories directly in a consumer.

As an example, let's create a custom logger for our example application.

```ts
import { Injectable } from '@angular/core';

import { LumberjackLogger, LumberjackService, LumberjackTimeService } from '@ngworker/lumberjack';

@Injectable({
  providedIn: 'root',
})
export class AppLogger extends LumberjackLogger {
  static scope = 'Forest App';

  forestOnFire = this.createCriticalLogger('The forest is on fire!').withScope(AppLogger.scope).build();

  helloForest = this.createInfoLogger('Hello, Forest!').withScope(AppLogger.scope).build();
}
```

#### Logger usage

Now that we have defined our first Lumberjack logger let's use it to log logs from our application.

```ts
import { inject, Component, OnInit } from '@angular/core';
import { LumberjackLogger } from '@ngworker/lumberjack';

import { AppLogger } from './app.logger';
import { ForestService } from './forest.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  private readonly logger = inject(AppLogger);
  private readonly forest = inject(ForestService);

  ngOnInit(): void {
    this.logger.helloForest();

    this.forest.fire$.subscribe(() => this.logger.forestOnFire());
  }
}
```

The previous example logs _Hello, Forest!_ when the application is initialized, then logs _The forest is on fire!_ if a
forest fire is detected.

#### Simplifying with ScopedLumberjackLogger

An alternative to the `LumberjackLogger` interface, where we need to specify the lumberjack log scope manually, we could
use the `ScopedLumberjackLogger`.

The `ScopedLumberjackLogger` is a convenient Logger and an excellent example of how to create custom Loggers according
to your situation.

```ts
/**
 * A scoped logger holds methods that log a predefined log sharing a scope.
 *
 * Implement application- and library-specific loggers by extending this base
 * class. Optionally supports a log payload.
 *
 * Each protected method on this base class returns a logger builder with a
 * predefined scope.
 */
@Injectable()
export abstract class ScopedLumberjackLogger<
  TPayload extends LumberjackLogPayload | void = void
> extends LumberjackLogger<TPayload> {
  abstract readonly scope: string;

  /**
   * Create a logger builder for a log with the shared scope as well as the
   * specified log level and message.
   */
  protected createLoggerBuilder(level: LumberjackLogLevel, message: string): LumberjackLoggerBuilder<TPayload> {
    return new LumberjackLoggerBuilder<TPayload>(this.lumberjack, this.time, level, message).withScope(this.scope);
  }
}
```

The resulting `AppLogger` after refactoring to using the `ScopedLumberjackLogger` would be:

```ts
import { Injectable } from '@angular/core';

import { LumberjackService, LumberjackTimeService, ScopedLumberjackLogger } from '@ngworker/lumberjack';

@Injectable({
  providedIn: 'root',
})
export class AppLogger extends ScopedLumberjackLogger {
  scope = 'Forest App';

  forestOnFire = this.createCriticalLogger('The forest is on fire!').build();

  helloForest = this.createInfoLogger('Hello, Forest!').build();
}
```

Notice that now every log written using the `AppLogger` will have the `'Forest App'` scope

#### Using Loggers with a LumberjackLog payload

As seen in the [Log drivers](#log-drivers) section, we can send extra info to our drivers using
a `LumberjackLog#payload`.

The `LumberjackLogger` and `ScopedLumberjackLogger` provide a convenient interface for such a scenario.

```ts
import { Injectable, VERSION } from '@angular/core';

import {
  LumberjackLogPayload,
  LumberjackService,
  LumberjackTimeService,
  ScopedLumberjackLogger,
} from '@ngworker/lumberjack';

export interface LogPayload extends LumberjackLogPayload {
  readonly angularVersion: string;
}

@Injectable({
  providedIn: 'root',
})
export class AppLogger extends ScopedLumberjackLogger<LogPayload> {
  private static readonly payload: LogPayload = {
    angularVersion: VERSION.full,
  };

  scope = 'Forest App';

  forestOnFire = this.createCriticalLogger('The forest is on fire!').build();

  helloForest = this.createInfoLogger('Hello, Forest!').withPayload(AppLogger.payload).build();
}
```

The `AppLogger` usage remains the same using a `LumberjackLogger` or `ScopedLumberjackLogger`, with payload or without.

### LumberjackLogFactory

Lumberjack's recommended way of creating logs is by using a `LumberjackLogger`.

However, there are some times that we want to create logs manually and pass them to the `LumberjackService`.

The `LumberjackLogFactory` provides a robust way of creating logs. It's also useful for creating logs in unit tests.

This is how we create logs manually:

```ts
import {inject, Component, OnInit, VERSION} from '@angular/core';

import {LumberjackLogFactory, LumberjackService} from '@ngworker/lumberjack';

import {LogPayload} from './log-payload';

@Component({
  selector: 'ngworker-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private readonly logFactory: inject<LumberjackLogFactory<LogPayload>>
(
  LumberjackLogFactory
);
  private readonly lumberjack = inject<LumberjackService<LogPayload>>(LumberjackService);
  private readonly payload: LogPayload = {
    angularVersion: VERSION.full,
  };
  private readonly scope = 'Forest App';

  ngOnInit(): void {
    const helloForest = this.logFactory
      .createInfoLog('Hello, Forest!')
      .withScope(this.scope)
      .withPayload(this.payload)
      .build();

    this.lumberjack.log(helloForest);
  }
}
```

## Wallaby.js

[![Wallaby.js](https://img.shields.io/badge/wallaby.js-powered-blue.svg?style=for-the-badge&logo=github)](https://wallabyjs.com/oss/)

Contributors to this repository are welcome to use the
[Wallaby.js OSS License](https://wallabyjs.com/oss/) to get
test results immediately as you type, and see the results in
your editor right next to your code.

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/NachoVazquez"><img src="https://avatars3.githubusercontent.com/u/9338604?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Nacho Vazquez</b></sub></a><br /><a href="https://github.com/ngworker/lumberjack/issues?q=author%3ANachoVazquez" title="Bug reports">🐛</a> <a href="https://github.com/ngworker/lumberjack/commits?author=NachoVazquez" title="Code">💻</a> <a href="https://github.com/ngworker/lumberjack/commits?author=NachoVazquez" title="Documentation">📖</a> <a href="#example-NachoVazquez" title="Examples">💡</a> <a href="#ideas-NachoVazquez" title="Ideas, Planning, & Feedback">🤔</a> <a href="#mentoring-NachoVazquez" title="Mentoring">🧑‍🏫</a> <a href="#maintenance-NachoVazquez" title="Maintenance">🚧</a> <a href="#projectManagement-NachoVazquez" title="Project Management">📆</a> <a href="https://github.com/ngworker/lumberjack/pulls?q=is%3Apr+reviewed-by%3ANachoVazquez" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/ngworker/lumberjack/commits?author=NachoVazquez" title="Tests">⚠️</a> <a href="#tool-NachoVazquez" title="Tools">🔧</a> <a href="#userTesting-NachoVazquez" title="User Testing">📓</a></td>
    <td align="center"><a href="https://dev.to/layzee/"><img src="https://avatars1.githubusercontent.com/u/6364586?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Lars Gyrup Brink Nielsen</b></sub></a><br /><a href="https://github.com/ngworker/lumberjack/issues?q=author%3ALayZeeDK" title="Bug reports">🐛</a> <a href="https://github.com/ngworker/lumberjack/commits?author=LayZeeDK" title="Code">💻</a> <a href="https://github.com/ngworker/lumberjack/commits?author=LayZeeDK" title="Documentation">📖</a> <a href="#example-LayZeeDK" title="Examples">💡</a> <a href="#ideas-LayZeeDK" title="Ideas, Planning, & Feedback">🤔</a> <a href="#mentoring-LayZeeDK" title="Mentoring">🧑‍🏫</a> <a href="#maintenance-LayZeeDK" title="Maintenance">🚧</a> <a href="#projectManagement-LayZeeDK" title="Project Management">📆</a> <a href="https://github.com/ngworker/lumberjack/pulls?q=is%3Apr+reviewed-by%3ALayZeeDK" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/ngworker/lumberjack/commits?author=LayZeeDK" title="Tests">⚠️</a> <a href="#tool-LayZeeDK" title="Tools">🔧</a> <a href="#userTesting-LayZeeDK" title="User Testing">📓</a></td>
    <td align="center"><a href="https://www.santoshyadav.dev/"><img src="https://avatars3.githubusercontent.com/u/11923975?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Santosh Yadav</b></sub></a><br /><a href="https://github.com/ngworker/lumberjack/commits?author=santoshyadavdev" title="Code">💻</a> <a href="https://github.com/ngworker/lumberjack/commits?author=santoshyadavdev" title="Documentation">📖</a> <a href="#example-santoshyadavdev" title="Examples">💡</a> <a href="#infra-santoshyadavdev" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#plugin-santoshyadavdev" title="Plugin/utility libraries">🔌</a> <a href="https://github.com/ngworker/lumberjack/commits?author=santoshyadavdev" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://dzhavat.github.io/"><img src="https://avatars0.githubusercontent.com/u/1096332?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Dzhavat Ushev</b></sub></a><br /><a href="https://github.com/ngworker/lumberjack/commits?author=dzhavat" title="Documentation">📖</a></td>
    <td align="center"><a href="https://twitter.com/AlexOkrushko"><img src="https://avatars0.githubusercontent.com/u/2830407?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Alex Okrushko</b></sub></a><br /><a href="https://github.com/ngworker/lumberjack/commits?author=alex-okrushko" title="Code">💻</a> <a href="#ideas-alex-okrushko" title="Ideas, Planning, & Feedback">🤔</a> <a href="#mentoring-alex-okrushko" title="Mentoring">🧑‍🏫</a> <a href="#research-alex-okrushko" title="Research">🔬</a> <a href="https://github.com/ngworker/lumberjack/commits?author=alex-okrushko" title="Code">💻</a></td>
    <td align="center"><a href="https://www.linkedin.com/in/serkan-sipahi-59b20081/"><img src="https://avatars.githubusercontent.com/u/1880749?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Bitcollage</b></sub></a><br /><a href="https://github.com/ngworker/lumberjack/issues?q=author%3ASerkanSipahi" title="Bug reports">🐛</a> <a href="https://github.com/ngworker/lumberjack/commits?author=SerkanSipahi" title="Code">💻</a> <a href="https://github.com/ngworker/lumberjack/commits?author=SerkanSipahi" title="Documentation">📖</a> <a href="#ideas-SerkanSipahi" title="Ideas, Planning, & Feedback">🤔</a> <a href="#platform-SerkanSipahi" title="Packaging/porting to new platform">📦</a> <a href="https://github.com/ngworker/lumberjack/pulls?q=is%3Apr+reviewed-by%3ASerkanSipahi" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/ngworker/lumberjack/commits?author=SerkanSipahi" title="Tests">⚠️</a> <a href="#tool-SerkanSipahi" title="Tools">🔧</a></td>
    <td align="center"><a href="https://github.com/agroupp"><img src="https://avatars.githubusercontent.com/u/20857362?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Arthur Groupp</b></sub></a><br /><a href="#ideas-agroupp" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/SergeyCherman"><img src="https://avatars.githubusercontent.com/u/10699293?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Serg</b></sub></a><br /><a href="https://github.com/ngworker/lumberjack/commits?author=SergeyCherman" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/sumitparakh"><img src="https://avatars.githubusercontent.com/u/4236211?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Sumit Parakh</b></sub></a><br /><a href="https://github.com/ngworker/lumberjack/commits?author=sumitparakh" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification.
Contributions of any kind welcome!
