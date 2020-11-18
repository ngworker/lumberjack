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

> Create Angular logs like a professional lumberjack

Lumberjack is a versatile Angular Logging library, specially defined to be extended and customized. It provides some out-of-the-box [log-driver](https://en.wikipedia.org/wiki/Log_driving), (logging mechanisms, transports, log-drivers) but you can easily decide which ones to use and create your owns.

## Features

- ✅ Configurable multilevel logging
- ✅ Plugin based (log-driver) architecture
- ✅ ConsoleDriver
- ✅ HttpDriver
- ✅ LogCreators Utils
- ✅ Best Practices guide

## Table of Contents

- [Installation](#installation)
- [Compatibility](#compatibility)
- [Usage](#usage)
- [Log Drivers](#log-drivers)
- [Proposed Best Practices](#proposed-best-practices)
- [Wallaby.js](#wallaby.js)
- [Contributors](#contributors)

## Installation

### NPM

`npm install @ngworker/lumberjack`

### Yarn

`yarn add @ngworker/lumberjack`

## Compatibility

`Lumberjack` has tested compatibility with the following Angular versions.

> If the version you are using is not listed, please rise an issue. This list only covers tested versions.

| Angular | Support |
| ------- | ------- |
| 11.0.x  | ✅      |
| 10.2.x  | ✅      |
| 10.1.x  | ✅      |
| 10.0.x  | ✅      |
| 9.1.x   | ✅      |
| 9.0.x   | ✅      |

## Usage

To start using this library just import it in your application root module.

```typescript
...,
LumberjackModule.forRoot({
  //options
}),
...,
```

You must also import the `LogDrivers` that you intend to use.

```typescript
...,
LumberjackModule.forRoot({
  //options
}),
ConsoleDriverModule.forRoot({
  //options
}),
HttpDriverModule.forRoot({
  levels: [LumberjackLogLevel.Error],
  origin: 'ForestApp',
  storeUrl: '/api/logs',
  retryOptions: { maxRetries: 5, delayMs: 250 },
}),
...,
```

The `LumberjackModule` can be initialized empty where it falls back to a default configuration or receive a `LumberjackLogOptions` object.

```typescript
export interface LumberjackLogOptions {
  format?: (logEntry: LumberjackLog) => string;
  levels?: LumberjackLogConfigLevel;
}
```

`format` is a function that receives a `LumberjackLog` and produces a string representation of the same.

`levels` are the default levels where the `drivers` are allowed to log. Each driver can override this configuration independently.

```typescript
/**
 * Represents a Lumberjack Log.
 *
 */
export interface LumberjackLog {
  level: LumberjackLogLevel;
  message: string;
  context: string | undefined;
}
```

### Using the `LumberjackService`

First, inject the `LumberjackService` where you want to use it.

```typescript
constructor(
    ...,
    private lumberjack: LumberjackService,
    ...,
  ) {}
```

Then you can start logging.

```typescript
this.lumberjack.log({
  level: LumberjackLogLevel.Info,
  message: 'Hello Forest',
  context: 'AppComponent',
  createdAt: Date.now(),
});
```

However, the above example is not the recommended way to define our logs.

More on this in the **Recommended Best Practices** section.

### Default configurations

`Lumberjack` configuration is flexible. You can provide a full configuration object, some partial options or non options at all.

The library replaces the options that you skip to provide with defaults.

When `format` is not provided, the library will use the following function as default

```typescript
format({ context, createdAt: timestamp, level, message }) {
  return `${level} ${time.utcTimestampFor(timestamp)}${context ? ` [${context}]` : ''}{message}`;
}
```

Where `time` is an instance of the `LumberjackTimeService`.

When `levels` is not provided a default levels config is provided depending on the environment

- Development

```typescript
export const defaultDevelopmentLevels: LumberjackLogConfigLevel = [LumberjackLogLevel.Verbose];
```

- Production

```typescript
export const defaultProductionLevels: LumberjackLogConfigLevel = [
  LumberjackLogLevel.Critical,
  LumberjackLogLevel.Error,
  LumberjackLogLevel.Info,
  LumberjackLogLevel.Warning,
];
```

## Log Drivers

We briefly introduce the term of `log-driver`, this section explains in depth how to use and configure them and how to create new ones.

A `log-driver` is the conduit used by the `LumberjackService` to write or persist the developer logs.

This library provides some basic `log-drivers` out of the box, the `ConsoleDriver` and the `HttpDriver`.

Every `log-driver` implements the interface `LogDriver`.

```typescript
export interface LogDriver {
  config: LogDriverConfig;
  logCritical(logEntry: string): void;
  logInfo(logEntry: string): void;
  logDebug(logEntry: string): void;
  logError(logEntry: string): void;
  logTrace(logEntry: string): void;
  logWarning(logEntry: string): void;
}
```

The above is the public API that every `log-driver` must implement.

### Creating your own Driver

Let's see the easiest implementation of a `log-driver`, the `ConsoleDriver`

```typescript
@Injectable()
export class ConsoleDriver implements LogDriver {
  constructor(
    @Inject(consoleDriverConfigToken) public config: LogDriverConfig,
    @Inject(lumberjackConsoleToken) private console: LumberjackConsole
  ) {}

  logCritical(logEntry: string): void {
    this.console.error(logEntry);
  }

  logDebug(logEntry: string): void {
    this.console.debug(logEntry);
  }

  logError(logEntry: string): void {
    this.console.error(logEntry);
  }

  logInfo(logEntry: string): void {
    this.console.info(logEntry);
  }

  logTrace(logEntry: string): void {
    // tslint:disable-next-line: no-console
    this.console.trace(logEntry);
  }

  logWarning(logEntry: string): void {
    this.console.warn(logEntry);
  }
}
```

There is nothing special about it, the only remarkable thing is that the config is passed down its constructor and that it is public. We will need a public configuration when interacting with the `log-drivers` at the `LumberjackService`

The `LumberjackConsole` is an abstraction of the `window.console`, it is not important for the behavior of the `ConsoleDriver` and you can ignore it for now and assume we are simply using the `window.console`.

### `ConsoleDriverModule`

The `DriverModule's` provides the configuration and other dependencies to the `log-drivers`. They also provide the `log-drivers`, making them available to the `LumberjackService`.

```typescript
@NgModule()
export class ConsoleDriverModule {
  static forRoot(config?: LogDriverConfig): ModuleWithProviders<ConsoleDriverRootModule> {
    return {
      ngModule: ConsoleDriverRootModule,
      providers: (config && [{ provide: consoleDriverConfigToken, useValue: config }]) || [],
    };
  }

  constructor() {
    throw new Error('Do not import ConsoleDriverModule directly. Use ConsoleDriverModule.forRoot.');
  }
}
```

In this implementation the `ConsoleDriverModule` is protected from being used directly. Instead we should use the `forRoot()` method.

The `forRoot()` method provides the `consoleDriverConfigToken`.

If none configuration is passed the default global `logDriverConfiguration` is used.

```typescript
export const consoleDriverConfigToken = new InjectionToken<LogDriverConfig>('__CONSOLE_DRIVER_CONFIG__', {
  factory: () => inject(logDriverConfigToken),
});
```

This is possible since the `ConsoleDriver` has the same configuration options as the `LogDriverConfig`. For more complex scenarios see [HttpDriver](https://github.com/ngworker/lumberjack/blob/main/libs/ngworker/lumberjack/http-driver/src/lib/http-driver-root.module.ts)

Finally, it returns the `ConsoleDriverRootModule` which holds the rest of the driver setup.

```typescript
@NgModule({
  providers: [
    {
      provide: logDriverToken,
      useClass: ConsoleDriver,
      multi: true,
    },
  ],
})
export class ConsoleDriverRootModule {
  constructor(
    // tslint:disable: no-any no-null-keyword
    @Optional()
    @SkipSelf()
    @Inject(ConsoleDriverRootModule)
    maybeNgModuleFromParentInjector: ConsoleDriverRootModule = null as any
    // tslint:enable: no-any no-null-keyword
  ) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'ConsoleDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
```

The most important thing about the `ConsoleDriverRootModule` is that it provides the `ConsoleDriver` using the `logDriverToken` with the `multi` flag on.

This allows us to provide multiple `log-drivers` at the same time and it is the feature enabling the extensibility of the `lumberjack` library.

`ConsoleDriverRootModule` is protected against multiple imports. Since `ConsoleDriverModule.forRoot()` should only be imported once.

The last step is to import this module at the root module of our application as seen in the first usage section.

```typescript
@NgModule({
  ...,
  imports: [
    ...,
    LumberjackModule.forRoot(),
    ConsoleDriverModule.forRoot(),
    ...
  ],
  ...
})
export class AppModule {}
```

### HttpDriver

For a more advanced example of a `driver` implementation check the [HttpDriver](https://github.com/ngworker/lumberjack/blob/main/projects/ngworker/lumberjack/http-driver/README.md)

## Proposed Best Practices

Every log can be represented as a combination of its level, creation time, message, and context. Using inline logs entries with the `LumberjackService` can cause structure duplication and-or de-standardization.

The following practices are recommended to mitigate these problems.

### LumberjackLogger

The `LumberjackLogger` service is an abstract class that wraps the `LumberjackService` helping us to create structured logs and reducing boilerplate.

This class is the base class for any other `Logger` that we need.

```typescript
@Injectable()
export abstract class LumberjackLogger {
  constructor(private lumberjack: LumberjackService, private time: LumberjackTimeService) {}

  protected createDebugLogger(message: string, context?: string): () => void {
    return this.createLogger(LumberjackLogLevel.Debug, message, context);
  }

  protected createErrorLogger(message: string, context?: string): () => void {
    return this.createLogger(LumberjackLogLevel.Error, message, context);
  }

  protected createInfoLogger(message: string, context?: string): () => void {
    return this.createLogger(LumberjackLogLevel.Info, message, context);
  }

  protected createWarningLogger(message: string, context?: string): () => void {
    return this.createLogger(LumberjackLogLevel.Warning, message, context);
  }

  private createLogger(level: LumberjackLogEntryLevel, message: string, context?: string): () => void {
    return () => {
      this.lumberjack.log({ context, createdAt: this.time.getUnixEpochTicks(), level, message });
    };
  }
}
```

By using the `LumberjackLogger` we only have to be worry about write our logs using passing a context and a message.

However can't use it directly, instead we are encourage to create a custom logger per **context**.

For example, let's create a custom logger for our example app.

```typescript
@Injectable({
  providedIn: 'root',
})
export class AppLogger extends LumberjackLogger {
  private static logContext = 'Forest App';

  constructor(lumberjack: LumberjackService, time: LumberjackTimeService) {
    super(lumberjack, time);
  }

  forestOnFire = this.createErrorLogger('The forest is on fire', AppLogger.logContext);

  helloForest = this.createInfoLogger('HelloForest', AppLogger.logContext);
}
```

#### Log usage

Now that we have defined our first `LumberjackLogger` let's use it to start adding log entries to our system.

```typescript
@Component({
  selector: 'ngworker-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'lumberjack';

  constructor(private logger: AppLogger) {}

  ngOnInit(): void {
    this.logger.helloForest();
    this.logger.forestOnFire();
  }
}
```

The `LumberjackLogger` is just one way to help you organize and structure you logs. We provide the `LumberjackLogger` as a help, however there are many ways to accomplish the same purpose.

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
