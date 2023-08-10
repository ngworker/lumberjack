---
sidebar_position: 4
title: Drivers
slug: '/drivers/'
---

Earlier, we briefly introduced the term _driver_. This section explains in depth how to use and configure them and
how to create custom drivers.

A driver is the conduit used by the Lumberjack to output or persist application logs.

Lumberjack offers basic drivers out-of-the-box, namely the `LumberjackConsoleDriver` and the `LumberjackAngularHttpDriver`.

Every driver implements the `LumberjackDriver` interface.

```ts
export interface LumberjackDriver<TPayload extends LumberjackLogPayload | void = void> {
  readonly config: LumberjackDriverConfig;

  logCritical(driverLog: LumberjackDriverLog<TPayload>): void;

  logDebug(driverLog: LumberjackDriverLog<TPayload>): void;

  logError(driverLog: LumberjackDriverLog<TPayload>): void;

  logInfo(driverLog: LumberjackDriverLog<TPayload>): void;

  logTrace(driverLog: LumberjackDriverLog<TPayload>): void;

  logWarning(driverLog: LumberjackDriverLog<TPayload>): void;
}
```

The `LumberjackDriverLog` holds a formatted string representation of the `LumberjackLog` and the `LumberjackLog`
itself.

```ts
export interface LumberjackDriverLog<TPayload extends LumberjackLogPayload | void = void> {
  readonly formattedLog: string;
  readonly log: LumberjackLog<TPayload>;
}
```

### Log levels

Drivers should make it possible to configure the logging levels on a per driver basis.

For example, we could use the default logging levels for the console driver, but only enable the critical and error
levels for the HTTP driver as seen in the following example.

```ts
import { NgModule } from '@angular/core';
import { LumberjackLevel, LumberjackModule } from '@lumberjackjs/angular';
import { LumberjackConsoleDriverModule } from '@lumberjackjs/angular/console-driver';
import { LumberjackAngularHttpDriverModule } from '@lumberjackjs/angular/http-driver';

@NgModule({
  imports: [
    LumberjackModule.forRoot({
      levels: [LumberjackLevel.Verbose],
    }),
    LumberjackConsoleDriverModule.forRoot(),
    LumberjackAngularHttpDriverModule.forRoot({
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

import { LumberjackLevel, provideLumberjack } from '@lumberjackjs/angular';
import { provideLumberjackConsoleDriver } from '@lumberjackjs/angular/console-driver';
import { provideLumberjackAngularHttpDriver, withHttpConfig } from '@lumberjackjs/angular/http-driver';

import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideLumberjack(),
    provideLumberjackConsoleDriver(),
    provideLumberjackAngularHttpDriver(
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

### Creating a custom driver

Let's create a simple driver for the browser console.

```ts
import { inject, Injectable } from '@angular/core';

import { LumberjackDriver, LumberjackDriverConfig, LumberjackDriverLog } from '@lumberjackjs/angular';

import { consoleDriverConfigToken } from './console-driver-config.token';

@Injectable()
export class ConsoleDriver implements LumberjackDriver {
  readonly config = inject(consoleDriverConfigToken);

  logCritical({ formattedLog }: LumberjackDriverLog): void {
    console.error(formattedLog);
  }

  logDebug({ formattedLog }: LumberjackDriverLog): void {
    console.debug(formattedLog);
  }

  logError({ formattedLog }: LumberjackDriverLog): void {
    console.error(formattedLog);
  }

  logInfo({ formattedLog }: LumberjackDriverLog): void {
    console.info(formattedLog);
  }

  logTrace({ formattedLog }: LumberjackDriverLog): void {
    console.trace(formattedLog);
  }

  logWarning({ formattedLog }: LumberjackDriverLog): void {
    console.warn(formattedLog);
  }
}
```

In the above snippet, the config is injected and assigned to the public `config` property. Lumberjack uses this
configuration to determine which logs the driver should handle.

#### Using a LumberjackLogPayload

We might want to add some extra data not present in the `LumberjackLog` to our driver.

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
  LumberjackDriver,
  LumberjackDriverConfig,
  LumberjackDriverLog,
  LumberjackLogPayload,
} from '@lumberjackjs/angular';

import { consoleDriverConfigToken } from './console-driver-config.token';

export interface AnalyticsPayload extends LumberjackLogPayload {
  angularVersion: string;
}

@Injectable()
export class ConsoleDriver implements LumberjackDriver<AnalyticsPayload> {
  readonly config = inject(consoleDriverConfigToken);

  logCritical({ formattedLog, log }: LumberjackDriverLog<AnalyticsPayload>): void {
    console.error(formattedLog, log.payload);
  }

  logDebug({ formattedLog, log }: LumberjackDriverLog<AnalyticsPayload>): void {
    console.debug(formattedLog, log.payload);
  }

  logError({ formattedLog, log }: LumberjackDriverLog<AnalyticsPayload>): void {
    console.error(formattedLog, log.payload);
  }

  logInfo({ formattedLog, log }: LumberjackDriverLog<AnalyticsPayload>): void {
    console.info(formattedLog, log.payload);
  }

  logTrace({ formattedLog, log }: LumberjackDriverLog<AnalyticsPayload>): void {
    console.trace(formattedLog, log.payload);
  }

  logWarning({ formattedLog, log }: LumberjackDriverLog<AnalyticsPayload>): void {
    console.warn(formattedLog, log.payload);
  }
}
```

#### Creating a custom driver module and provider functions

The provide functions provides configuration and other dependencies to a driver. It also provides the driver,
making
it available to Lumberjack.

```ts
import { Provider } from '@angular/core';

import { LumberjackDriverConfig, lumberjackDriverConfigToken, lumberjackDriverToken } from '@lumberjackjs/angular';

import { LumberjackConsoleDriver } from '../drivers/lumberjack-console.driver';

import { lumberjackConsoleDriverConfigToken } from './lumberjack-console-driver-config.token';
import { LumberjackConsoleDriverConfig } from './lumberjack-console-driver.config';

export function provideLumberjackConsoleDriver(config: Partial<LumberjackConsoleDriverConfig> = {}): Provider[] {
  return [
    {
      provide: lumberjackConsoleDriverConfigToken,
      deps: [lumberjackDriverConfigToken],
      useFactory: (driverConfig: LumberjackDriverConfig): LumberjackConsoleDriverConfig => ({
        ...driverConfig,
        identifier: LumberjackConsoleDriver.driverIdentifier,
        ...config,
      }),
    },
    {
      provide: lumberjackDriverToken,
      useClass: LumberjackConsoleDriver,
      multi: true,
    },
  ];
}
```

The driver module then acts as a wrapper for the driver and the provide function.

```ts
import { ModuleWithProviders, NgModule } from '@angular/core';

import { LumberjackConsoleDriverRootModule } from './lumberjack-console-driver-root.module';
import { LumberjackConsoleDriverConfig } from './lumberjack-console-driver.config';
import { provideLumberjackConsoleDriver } from './lumberjack-console-driver.providers';

@NgModule()
export class Lumberj
```
