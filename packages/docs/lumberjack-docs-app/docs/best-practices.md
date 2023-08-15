---
sidebar_position: 6
title: Best practices
---

Every log can be represented as a combination of its level, creation time, message, scope and payload. Using inline logs
with the `LumberjackOrchestrator` can cause structure duplication and/or denormalization.

Continue reading to know more about the recommended best practices designed to tackle this issue.

### Loggers

The `LumberjackLogger` service is an abstract class that wraps the `LumberjackOrchestrator` to help us create structured logs
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
    protected lumberjack: LumberjackOrchestrator<TPayload>;
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

import { LumberjackLogger, LumberjackOrchestrator, LumberjackTimeService } from '@lumberjackjs/angular';

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
import { LumberjackLogger } from '@lumberjackjs/angular';

import { AppLogger } from './app.logger';
import { ForestService } from './forest.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  readonly #logger = inject(AppLogger);
  readonly #forest = inject(ForestService);

  ngOnInit(): void {
    this.#logger.helloForest();

    this.#forest.fire$.subscribe(() => this.#logger.forestOnFire());
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

import { LumberjackOrchestrator, LumberjackTimeService, ScopedLumberjackLogger } from '@lumberjackjs/angular';

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

As seen in the [Drivers](./drivers/) section, we can send extra info to our drivers using
a `LumberjackLog#payload`.

The `LumberjackLogger` and `ScopedLumberjackLogger` provide a convenient interface for such a scenario.

```ts
import { Injectable, VERSION } from '@angular/core';

import {
  LumberjackLogPayload,
  LumberjackOrchestrator,
  LumberjackTimeService,
  ScopedLumberjackLogger,
} from '@lumberjackjs/angular';

export interface LogPayload extends LumberjackLogPayload {
  readonly angularVersion: string;
}

@Injectable({
  providedIn: 'root',
})
export class AppLogger extends ScopedLumberjackLogger<LogPayload> {
  static readonly #payload: LogPayload = {
    angularVersion: VERSION.full,
  };

  scope = 'Forest App';

  forestOnFire = this.createCriticalLogger('The forest is on fire!').build();

  helloForest = this.createInfoLogger('Hello, Forest!').withPayload(AppLogger.#payload).build();
}
```

The `AppLogger` usage remains the same using a `LumberjackLogger` or `ScopedLumberjackLogger`, with payload or without.

### LumberjackLogFactory

Lumberjack's recommended way of creating logs is by using a `LumberjackLogger`.

However, there are some times that we want to create logs manually and pass them to the `LumberjackOrchestrator`.

The `LumberjackLogFactory` provides a robust way of creating logs. It's also useful for creating logs in unit tests.

This is how we create logs manually:

```ts
import {inject, Component, OnInit, VERSION} from '@angular/core';

import {LumberjackLogFactory, LumberjackOrchestrator} from '@lumberjackjs/angular';

import {LogPayload} from './log-payload';

@Component({
  selector: 'lumberjackjs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  readonly #logFactory: inject<LumberjackLogFactory<LogPayload>>
(
  LumberjackLogFactory
);
  readonly #lumberjack = inject<LumberjackOrchestrator<LogPayload>>(LumberjackOrchestrator);
  readonly #payload: LogPayload = {
    angularVersion: VERSION.full,
  };
  readonly #scope = 'Forest App';

  ngOnInit(): void {
    const helloForest = this.#logFactory
      .createInfoLog('Hello, Forest!')
      .withScope(this.scope)
      .withPayload(this.payload)
      .build();

    this.#lumberjack.log(helloForest);
  }
}
```
