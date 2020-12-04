> Chop and cut Angular logs like a professional lumberjack.

<p align="center">
 <img width="40%" height="40%" src="./logo.svg">
</p>

[Logo by Felipe Zambrano](http://instagram.com/octopez)

<br />

[![MIT](https://img.shields.io/packagist/l/doctrine/orm.svg?style=flat-square)]()
[![commitizen](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)]()
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)]()
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)
[![ngworker](https://img.shields.io/badge/ngworker-%40-red)](https://github.com/ngworker/)
[![spectator](https://img.shields.io/badge/tested%20with-spectator-2196F3.svg?style=flat-square)]()
[![Wallaby.js](https://img.shields.io/badge/wallaby.js-powered-blue.svg?style=flat&logo=github)](https://wallabyjs.com/oss/)

Lumberjack is a versatile Angular logging library, specially designed to be extended and customized. It provides a few simple [log drivers](https://en.wikipedia.org/wiki/Log_driving) (logging mechanisms, transports, log drivers) out-of-the-box. It's easy to enable bundled log drivers or create and use custom log drivers.

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
- [Compatibility](#compatibility)
- [Usage](#usage)
- [Log drivers](#log-drivers)
- [Best practices](#best-practices)
- [Wallaby.js](#wallaby.js)
- [Contributors](#contributors)

## Installation

Lumberjack is published as the `@ngworker/lumberjack` package.

| Toolchain   | Command                            |
| ----------- | ---------------------------------- |
| Angular CLI | `ng add @ngworker/lumberjack`      |
| NPM CLI     | `npm install @ngworker/lumberjack` |
| Nx CLI      | `nx add @ngworker/lumberjack`      |
| Yarn CLI    | `yarn add @ngworker/lumberjack`    |

## Compatibility

Lumberjack version 2.x has verified compatibility with the following Angular versions.

| Angular version | Lumberjack 2.x support |
| --------------- | ---------------------- |
| 11.0.x          | ✅                     |
| 10.2.x          | ✅                     |
| 10.1.x          | ✅                     |
| 10.0.x          | ✅                     |
| 9.1.x           | ✅                     |
| 9.0.x           | ✅                     |

If the version you are using is not listed, please [raise an issue in our GitHub repository](https://github.com/ngworker/lumberjack/issues/new).

## Usage

To start using Lumberjack, import it in your root or core Angular module.

```ts
@NgModule({
  imports: [
    LumberjackModule.forRoot(),
    // (...)
  ],
  // (...)
})
export class AppModule {}
```

You must also import log driver modules for the log drivers that you want to enable.

```ts
@NgModule({
  imports: [
    LumberjackModule.forRoot(),
    LumberjackConsoleDriverModule.forRoot(),
    LumberjackHttpDriverModule.withOptions({
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

### Using the `LumberjackService`

For quick or simple use cases, you can use the `LumberjackService` directly by passing logs to its `log` method. However, we recommend implementing application-specific logger services instead. See the [_Best practices_](#best-practices) section.

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

Then you can start logging.

```ts
// (...)
export class MyComponent implements OnInit {
  // (...)
  ngOnInit(): void {
    this.lumberjack.log({
      level: LumberjackLogLevel.Info,
      message: 'Hello, World!',
      context: 'MyComponent',
      createdAt: Date.now(),
    });
  }
}
```

### LumberjackModule

Optionally, we can pass one or more options to `LumberjackModule.forRoot`.

| Option   | Type                           | Optional? | Description                                                          |
| -------- | ------------------------------ | --------- | -------------------------------------------------------------------- |
| `format` | (log: LumberjackLog) => string | Yes       | Pass a custom formatter to transform a log into a log message.       |
| `levels` | `LumberjackConfigLevels`       | Yes       | The root log levels defining the default log levels for log drivers. |

### Default options

Lumberjack's configuration is flexible. You can provide a full configuration object, a partial option set or no options at all.

Lumberjack replaces omitted options with defaults.

When the `format` option is not configured, Lumberjack will use the following default formatter.

```ts
function lumberjackFormatLog({ context, createdAt: timestamp, level, message }: LumberjackLog) {
  return `${level} ${utcTimestampFor(timestamp)}${context ? ` [${context}]` : ''} ${message}`;
}
```

Where `utcTimestampFor` is a function that converts Unix Epoch ticks to UTC 0 hours offset with milliseconds resolution.

#### Default log levels

When the `levels` setting is not configured, log levels are configured depending on whether your application is running in development mode or production mode.

By default, **all** log levels are enabled in development mode.

In production mode, the following log levels are enabled by default:

- Critical
- Error
- Info
- Warning

## Log drivers

Earlier, we briefly introduced the term _log driver_. This section explains in depth how to use and configure them as well as how to create custom log drivers.

A log driver is the conduit used by the Lumberjack to output or persist application logs.

Lumberjack offers basic log drivers out-of-the-box, namely the `LumberjackConsoleDriver` and the `LumberjackHttpDriver`.

Every log driver implements the `LumberjackLogDriver` interface.

```ts
interface LumberjackLogDriver {
  readonly config: LumberjackLogDriverConfig;
  logCritical(formattedLog: string): void;
  logDebug(formattedLog: string): void;
  logError(formattedLog: string): void;
  logInfo(formattedLog: string): void;
  logTrace(formattedLog: string): void;
  logWarning(formattedLog: string): void;
}
```

### Log levels

Log drivers should make it possible to configure the logging levels on a per driver basis.

For example, we could use the default logging levels for the console driver, but only enable the critical and error levels for the HTTP driver as seen in the following example.

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

### Creating a custom log driver

Let's create a simple log driver for the browser console.

```ts
import { Injectable } from '@angular/core';
import { LumberjackLogDriver, LumberjackLogDriverConfig } from '@ngworker/lumberjack';

import { consoleDriverConfigToken } from './console-driver-config.token';

@Injectable()
export class ConsoleDriver implements LumberjackLogDriver {
  constructor(@Inject(consoleDriverConfigToken) public config: LumberjackLogDriverConfig) {}

  logCritical(formattedLog: string): void {
    console.error(formattedLog);
  }

  logDebug(formattedLog: string): void {
    console.debug(formattedLog);
  }

  logError(formattedLog: string): void {
    console.error(formattedLog);
  }

  logInfo(formattedLog: string): void {
    console.info(formattedLog);
  }

  logTrace(formattedLog: string): void {
    console.trace(formattedLog);
  }

  logWarning(formattedLog: string): void {
    console.warn(formattedLog);
  }
}
```

There is nothing special about it. The only remarkable thing is that the config is passed down its constructor and that it is assigned to the public `config` property. Lumberjack uses this configuration to determine which logs to pass to the driver.

#### Creating a custom log driver module

A driver module provides configuration and other dependencies to a log driver. It also provides the log driver, making it available to Lumberjack.

```ts
import { ModuleWithProviders, NgModule } from '@angular/core';
import { LumberjackLogDriverConfig, lumberjackLogDriverToken } from '@ngworker/lumberjack';

import { consoleDriverConfigToken } from './console-driver-config.token';

@NgModule({
  providers: [
    {
      provide: lumberjackLogDriverToken,
      useClass: ConsoleDriver,
      multi: true,
    },
  ],
})
export class ConsoleDriverModule {
  static forRoot(config?: LumberjackLogDriverConfig): ModuleWithProviders<ConsoleDriverModule> {
    return {
      ngModule: ConsoleDriverModule,
      providers: (config && [{ provide: consoleDriverConfigToken, useValue: config }]) || [],
    };
  }
}
```

The static `forRoot()` method provides the `consoleDriverConfigToken`.

If no configuration is passed, then the root `LogDriverConfig` is used.

```ts
import { InjectionToken } from '@angular/core';
import { LumberjackLogDriverConfig, lumberjackLogDriverConfigToken } from '@ngworker/lumberjack';

export const consoleDriverConfigToken = new InjectionToken<LumberjackLogDriverConfig>('__CONSOLE_DRIVER__CONFIG__', {
  factory: () => inject(lumberjackLogDriverConfigToken),
});
```

This is possible because the `ConsoleDriver` has the same configuration options as the `LumberjackLogDriverConfig`. For adding custom settings, see [LumberjackHttpDriver](https://github.com/ngworker/lumberjack/blob/main/libs/ngworker/lumberjack/http-driver/src/lib/lumberjack-http-driver-root.module.ts).

The most important thing about the `ConsoleDriverModule` is that it provides the `ConsoleDriver` using the `lumberjackLogDriverToken` with the `multi` flag on. This allows us to provide multiple log drivers for Lumberjack at the same time.

#### Using a custom log driver

The last step is to import this module at the root module of our application as seen in the first [_Usage_](#usage) section.

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

### HTTP driver

For a more advanced log driver implementation, see [LumberjackHttpDriver](https://github.com/ngworker/lumberjack/blob/main/projects/ngworker/lumberjack/http-driver/README.md)

## Best practices

Every log can be represented as a combination of its level, creation time, message, and context. Using inline logs with the `LumberjackService` can cause structure duplication and/or de-standardization.

The following practices are recommended to mitigate these problems.

### Loggers

The `LumberjackLogger` service is an abstract class that wraps the `LumberjackService` to help us create structured logs and reduce boilerplate. At the same time, it provides testing capabilities since we can easily spy on logger methods and control timestamps by replacing the `LumberjackTimeService`.

`LumberjackLogger` is used as the base class for any other logger that we need.

This is the abstract interface of `LumberjackLogger`:

```ts
import { LumberjackService, LumberjackTimeService } from '@ngworker/lumberjack';

export abstract class LumberjackLogger {
  constructor(lumberjack: LumberjackService, time: LumberjackTimeService) {}

  protected createCriticalLogger(message: string, context?: string): () => void {}
  protected createDebugLogger(message: string, context?: string): () => void {}
  protected createErrorLogger(message: string, context?: string): () => void {}
  protected createInfoLogger(message: string, context?: string): () => void {}
  protected createTraceLogger(message: string, context?: string): () => void {}
  protected createWarningLogger(message: string, context?: string): () => void {}
}
```

By extending `LumberjackLogger`, we only have to be worry about the message and context of our pre-defined logs.

All logger factory methods are protected as it is recommended to create a custom logger per _context_ rather than using logger factories directly in a consumer.

As an example, let's create a custom logger for our example application.

```ts
import { Injectable } from '@angular/core';
import { LumberjackLogger } from '@ngworker/lumberjack';

@Injectable({
  providedIn: 'root',
})
export class AppLogger extends LumberjackLogger {
  public static logContext = 'Forest App';

  forestOnFire = this.createCriticalLogger('The forest is on fire!', AppLogger.logContext);

  helloForest = this.createInfoLogger('Hello, forest!', AppLogger.logContext);
}
```

#### Logger usage

Now that we have defined our first Lumberjack logger, let's use it to log logs from our application.

```ts
import { Component, OnInit } from '@angular/core';
import { LumberjackLogger } from '@ngworker/lumberjack';

import { AppLogger } from './app.logger';
import { ForestService } from './forest.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor(private logger: AppLogger, private forest: ForestService) {}

  ngOnInit(): void {
    this.logger.helloForest();

    this.forest.fire$.subscribe(() => this.logger.forestOnFire());
  }
}
```

The previous example logs _Hello, forest!_ when the application is initialized, then logs _The forest is on fire!_ if a forest fire is detected.

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
    <td align="center"><a href="https://github.com/NachoVazquez"><img src="https://avatars3.githubusercontent.com/u/9338604?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Nacho Vazquez</b></sub></a><br /><a href="#question-NachoVazquez" title="Answering Questions">💬</a> <a href="https://github.com/@ngworker/lumberjack/issues?q=author%3ANachoVazquez" title="Bug reports">🐛</a> <a href="#business-NachoVazquez" title="Business development">💼</a> <a href="https://github.com/@ngworker/lumberjack/commits?author=NachoVazquez" title="Code">💻</a> <a href="https://github.com/@ngworker/lumberjack/commits?author=NachoVazquez" title="Documentation">📖</a> <a href="#example-NachoVazquez" title="Examples">💡</a> <a href="#ideas-NachoVazquez" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-NachoVazquez" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-NachoVazquez" title="Maintenance">🚧</a> <a href="#projectManagement-NachoVazquez" title="Project Management">📆</a> <a href="https://github.com/@ngworker/lumberjack/pulls?q=is%3Apr+reviewed-by%3ANachoVazquez" title="Reviewed Pull Requests">👀</a> <a href="#security-NachoVazquez" title="Security">🛡️</a> <a href="https://github.com/@ngworker/lumberjack/commits?author=NachoVazquez" title="Tests">⚠️</a> <a href="#tool-NachoVazquez" title="Tools">🔧</a> <a href="#userTesting-NachoVazquez" title="User Testing">📓</a></td>
    <td align="center"><a href="https://indepth.dev/author/layzee/"><img src="https://avatars1.githubusercontent.com/u/6364586?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Lars Gyrup Brink Nielsen</b></sub></a><br /><a href="https://github.com/@ngworker/lumberjack/issues?q=author%3ALayZeeDK" title="Bug reports">🐛</a> <a href="https://github.com/@ngworker/lumberjack/commits?author=LayZeeDK" title="Code">💻</a> <a href="https://github.com/@ngworker/lumberjack/commits?author=LayZeeDK" title="Documentation">📖</a> <a href="#example-LayZeeDK" title="Examples">💡</a> <a href="#ideas-LayZeeDK" title="Ideas, Planning, & Feedback">🤔</a> <a href="#mentoring-LayZeeDK" title="Mentoring">🧑‍🏫</a> <a href="#plugin-LayZeeDK" title="Plugin/utility libraries">🔌</a> <a href="https://github.com/@ngworker/lumberjack/pulls?q=is%3Apr+reviewed-by%3ALayZeeDK" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/@ngworker/lumberjack/commits?author=LayZeeDK" title="Tests">⚠️</a> <a href="#tool-LayZeeDK" title="Tools">🔧</a> <a href="#userTesting-LayZeeDK" title="User Testing">📓</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
