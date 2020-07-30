<p align="center">
 <img width="40%" height="40%" src="./logo.svg">
</p>

[Logo by Felipe Zambrano](http://instagram.com/octopez)

<br />

[![MIT](https://img.shields.io/packagist/l/doctrine/orm.svg?style=flat-square)]()
[![commitizen](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)]()
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)]()
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)
[![ngneat](https://img.shields.io/badge/@-ngneat-383636?style=flat-square&labelColor=8f68d4)](https://github.com/ngneat/)
[![spectator](https://img.shields.io/badge/tested%20with-spectator-2196F3.svg?style=flat-square)]()

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
- [Usage](#usage)
- [FAQ](#faq)

## Installation

### NPM

`npm install @ngworker/lumberjack --save-dev`

### Yarn

`yarn add @ngworker/lumberjack --dev`

## Usage

To start using this app just import it in your application root module.

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
ConsoleDriverModule.forRoot(),
HttpDriverModule.forRoot({
  origin: 'LoggedExampleApp',
  storeUrl: environment.baseUrl,
  logWagonSize: 1
    }),
...,
```

The `LumberjackModule` can be initialized empty where it falls back to a default configuration or receive a `LumberjackLogConfig` object.

```typescript
export interface LumberjackLogConfig {
  format(logEntry: LumberjackLog): string;
}
```

`format` is a function that receives a `LumberjackLog` and produces a string representation of the same.

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
  message: 'Hello Forrest',
  context: 'AppComponent',
});
```

However, the above example is not the recommended way to define our logs.

More on this in the **Recomended Best Practices** section.

### Default configurations

As seen for now the only configurable item for `lumberjack` is the format function.

Its default implementation can be seen below.

```typescript
export const defaultLogConfig: LumberjackLogConfig = {
  format(logEntry: LumberjackLog) {
    return `${logEntry.level.toString()}  ${new Date().toISOString()}  [${logEntry.context}] ${logEntry.message}`;
  },
};
```

The `LumberjackLogConfig` will be expanded as new functionalities are added to the library.

It is recommended to implement different logging configuration, looking the best fit for the current scenario.

## Log Drivers

We briefly introduce the term of `log-driver`, this section explains in depth how to use and modified them and how to create new ones.

A `log-driver` is the conduit used by the `LumberjackService` to write or persist the developer logs.

This library provides some basic `log-drivers` out of the box, the `ConsoleDriver` and the `HttpDriver`.

> Note: Consider the HttpDriver as an example of what can be achieved. It may not fit your app requirements.

Every `log-driver` implements the interface `LogDriver`.

```typescript
export interface LogDriver {
  config: LogDriverConfig;
  logInfo(logEntry: string): void;
  logDebug(logEntry: string): void;
  logError(logEntry: string): void;
  logWarning(logEntry: string): void;
}
```

The above is the public API that every `log-driver` must implement.

### Creating your own Driver

Let's see the easiest implementation of a `log-driver`, the `ConsoleDriver`

```typescript
export class ConsoleDriver implements LogDriver {
  constructor(public config: LogDriverConfig) {}

  logInfo(logEntry: string): void {
    console.log(logEntry);
  }
  logDebug(logEntry: string): void {
    console.log(logEntry);
  }
  logError(logEntry: string): void {
    console.error(logEntry);
  }
  logWarning(logEntry: string): void {
    console.warn(logEntry);
  }
}
```

There is nothing special about it, the only remarkable thing is that the config is passed down its constructor and that it is public. We will need a public configuration when interacting with the `log-drivers` at the `LumberjackService`

### `ConsoleDriverModule`

The `DriverModules` provides the configuration and other dependencies to the `log-drivers`, while providing them (for DI), so the `LumberjackService` could inject them.

```typescript
// factory functions need to be extracted and exported for AOT
export function consoleFactory(config: LogDriverConfig): ConsoleDriver {
  return new ConsoleDriver(config);
}

@NgModule()
export class ConsoleDriverModule {
  static forRoot(config: LogDriverConfig = {}): ModuleWithProviders {
    return {
      ngModule: ConsoleDriverModule,
      providers: [
        { provide: LogDriverConfigToken, useValue: config },
        {
          provide: LogDriverToken,
          useFactory: consoleFactory,
          multi: true,
          deps: [LogDriverConfigToken],
        },
      ],
    };
  }
}
```

As seen the `ConsoleDriverModule` receives a config which extends the `LogDriverConfig` and passes it to the `log-driver`.

But the most important thing about the `ConsoleDriverModule` is that it provides the `ConsoleDriver` using the `LogDriverToken` using the `multi` flag on.

This allows us to provide multiple `log-drivers` at the same time and is the feature enabling the extensibility of the `lumberjack` library.

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

If not configuration is passed the default configuration is assumed.

## Proposed Best Practices

Every log can be represented as a combination of its level, message, and context. Using inline logs entries with the `LumberjackService` can cause structure duplication and-or de-standardization.

As a way to avoid these problems, the following practices are recommended.

### Log definitions

Inspired on events from event-driven architectures and Redux/NgRx actions a Log creator was implemented. The function `createLog` shown below, receives a log level, a message, and a context and returns a factory function of `LumberjackLog` elements.

```typescript
/**
 * Represents a Nevco specific log.
 *
 * @export
 * @interface LumberjackLog
 */
export interface LumberjackLog {
  level: LumberjackLogLevel;
  message: string;
  context: string | undefined;
}

export function createLog(level: LumberjackLogLevel, message: string, context?: string): () => LumberjackLog {
  return () => ({ level, message, context });
}
```

Every `LumberjackLogLevel` SHOULD have a folder where the well-defined logs are implemented. We CAN further organize the logs by grouping them by feature, app or context using Typescript modules (files).

Each `LumberjackLogLevel` folder contains an `index.ts` file where a composed log creator is implemented making the creation of logs of the same level less verbose.

The following is one of such **LogLevel-wise** log creators, in this case for the logs of level `Info`.

```typescript
export function createInfoLog(message: string, context: string = ''): () => LumberjackLog {
  return createLog(LumberjackLogLevel.Info, message, context);
}
```

Once our creators are defined, we can start adding our logs following the chosen folder/file structure, but always respecting the log level folder distribution.

```typescript
export const ExampleInfoLog = createInfoLog('Two Projects has been found at the organization', 'SceneEditorComponent');
```

By following these guidelines you ensure that your log levels aren't duplicated and that their structure is homogeneous across the workspace. They are also easy to find and modify.

#### Log usage

Now that we have defined our first `LumberjackLog` creator let's use `LumberjackService` to start adding log entries to our system.

```typescript
@Component({
  selector: 'new-forrest',
  templateUrl: './forrest.component.html',
  styleUrls: ['./forrest.component.scss']
})
export class ForrestComponent {
  ...

  constructor(
    ...,
    private logger: LumberjackService
  ) {
    this.logger.log(ExampleInfoLog());
  }
}
```

## Understanding the LumberjackService

In previous sections, we have seen how easy is to create `log-drivers` that will be used across the application.

We just need to implement the log-driver interface and provide our `log-driver` in its module using the `LogDriverToken` with the `multi` flag on.

In this section, we will see the element that unifies all `log-drivers` in the application. The `LumberjackService`.

Let start with is constructor and base declaration

```typescript
/**
 * Service responsible to add logs to the applications.
 *
 * It's API provides a single `log` method, which will load all `log-drivers`
 * provided through the application.
 *
 *
 */
@Injectable({ providedIn: 'root' })
export class LumberjackService {
  constructor(
    @Inject(LumberjackLogConfigToken) private config: LumberjackLogConfig,
    // Each log-driver must be provided with multi. That way we can capture every provided log-driver
    // and use it to log to its output.
    @Inject(LogDriverToken) private logDrivers: LogDriver[]
  ) {}
}
```

This class is a singleton, tree-shakable, root-injector level service.

Its constructor receives a `LumberjackLogConfig` with the global configuration of the library and a list with all the injected `log-drivers`.

To be able to receive several implementations of the `LogDriverToken` they should be provided with `multi` as shown above.

The public API of the service is a single `log` method.

```typescript
log(logItem: LumberjackLog): void {
    const { format } = this.config;

    for (const logDriver of this.logDrivers) {
      if (this.canDriveLog(logDriver, logItem.level)) {
        this.logToTheRightLevel(logDriver, logItem, format);
      }
    }
  }
```

It just iterates over the available `log-drivers` and logs to the right level if possible.

The rest of the implementation is shown below

```typescript
/**
 * Service responsible to add logs to the applications.
 *
 * It's API provides a single `log` method, which will load all `log-drivers`
 * provided through the application.
 *
 *
 */
@Injectable({ providedIn: 'root' })
export class LumberjackService {
  constructor(
    @Inject(LumberjackLogConfigToken) private config: LumberjackLogConfig,
    // Each driver must be provided with multi. That way we can capture every provided driver
    // and use it to log to its output.
    @Inject(LogDriverToken) private logDrivers: LogDriver[]
  ) {}

  log(logItem: LumberjackLog): void {
    const { format } = this.config;

    for (const logDriver of this.logDrivers) {
      if (this.canDriveLog(logDriver, logItem.level)) {
        this.logToTheRightLevel(logDriver, logItem, format);
      }
    }
  }

  private canDriveLog(driver: LogDriver, level: LumberjackLogLevel): boolean {
    return driver.config.levels === undefined || driver.config.levels.includes(level);
  }

  private logToTheRightLevel(
    driver: LogDriver,
    logItem: LumberjackLog,
    format: (logEntry: LumberjackLog) => string
  ): void {
    switch (logItem.level) {
      case LumberjackLogLevel.Info:
        driver.logInfo(format(logItem));

        break;
      case LumberjackLogLevel.Error:
        driver.logError(format(logItem));

        break;
      case LumberjackLogLevel.Warning:
        driver.logWarning(format(logItem));

        break;
      case LumberjackLogLevel.Debug:
        driver.logDebug(format(logItem));

        break;
      default:
        driver.logInfo(format(logItem));

        break;
    }
  }
}
```

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/NachoVazquez"><img src="https://avatars3.githubusercontent.com/u/9338604?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Nacho Vazquez</b></sub></a><br /><a href="#question-NachoVazquez" title="Answering Questions">💬</a> <a href="https://github.com/@ngworker/lumberjack/issues?q=author%3ANachoVazquez" title="Bug reports">🐛</a> <a href="#business-NachoVazquez" title="Business development">💼</a> <a href="https://github.com/@ngworker/lumberjack/commits?author=NachoVazquez" title="Code">💻</a> <a href="https://github.com/@ngworker/lumberjack/commits?author=NachoVazquez" title="Documentation">📖</a> <a href="#example-NachoVazquez" title="Examples">💡</a> <a href="#ideas-NachoVazquez" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-NachoVazquez" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-NachoVazquez" title="Maintenance">🚧</a> <a href="#projectManagement-NachoVazquez" title="Project Management">📆</a> <a href="https://github.com/@ngworker/lumberjack/pulls?q=is%3Apr+reviewed-by%3ANachoVazquez" title="Reviewed Pull Requests">👀</a> <a href="#security-NachoVazquez" title="Security">🛡️</a> <a href="https://github.com/@ngworker/lumberjack/commits?author=NachoVazquez" title="Tests">⚠️</a> <a href="#tool-NachoVazquez" title="Tools">🔧</a> <a href="#userTesting-NachoVazquez" title="User Testing">📓</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
