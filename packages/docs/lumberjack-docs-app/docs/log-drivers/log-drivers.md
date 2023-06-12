---
sidebar_position: 4
title: Log drivers
slug: '/log-drivers/'
---

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

Or use the standalone version of the API

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
see [LumberjackHttpDriver](https://github.com/ngworker/lumberjack/blob/main/packages/ngworker/lumberjack/http-driver/src/lib/configuration/lumberjack-http-driver-root.module.ts).

The most important thing about the `LumberjackConsoleDriverModule` is that it provides the `LumberjackConsoleDriver`
using the `lumberjackLogDriverToken` with the `multi` flag on. This allows us to provide multiple log drivers for
Lumberjack at the same time.

#### Using a custom log driver

The last step is to import this module at the root module of our application, as seen in the first [_Usage_](../usage)
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

Or using the standalone API.

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
see [LumberjackHttpDriver](./http-driver)
