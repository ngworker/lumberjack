# HttpDriver

This `driver` is used to send an **HTTP** request to a configured **Log Store** server.

Take this implementation as an advanced example of a `driver` implementation. Some of the decisions made are not compatible with every existing **Log Store**.

If more than one **Log Store** is supported, or multiple endpoints for the same **Log Store** are used; one `HttpDriverModule` **SHOULD** be configured per **Log Store**/**Log Endpoint**.

## Implementation

The following are complementary interfaces for the `driver` implementation.

```typescript
interface HttpLogEntry {
  logEntry: string;
  level: LumberjackLogLevel;
  origin: string;
}
```

The `HttpLogEntry` is the object sent to the **Log Store**.

The rest of the `HttpDriver` is defined as follows

```typescript
@Injectable()
export class HttpDriver implements LogDriver {
  constructor(
    private http: HttpClient,
    @Inject(httpDriverConfigToken) public config: HttpDriverConfig,
    private ngZone: NgZone
  ) {}

  logCritical(logEntry: string): void {
    this.sendLog(logEntry, LumberjackLogLevel.Critical);
  }

  logDebug(logEntry: string): void {
    this.sendLog(logEntry, LumberjackLogLevel.Debug);
  }

  logError(logEntry: string): void {
    this.sendLog(logEntry, LumberjackLogLevel.Error);
  }

  logInfo(logEntry: string): void {
    this.sendLog(logEntry, LumberjackLogLevel.Info);
  }

  logTrace(logEntry: string): void {
    this.sendLog(logEntry, LumberjackLogLevel.Trace);
  }

  logWarning(logEntry: string): void {
    this.sendLog(logEntry, LumberjackLogLevel.Warning);
  }

  private sendLog(logEntry: string, level: LumberjackLogLevel): void {
    const { origin, storeUrl, retryOptions } = this.config;
    const httpLogEntry: HttpLogEntry = { logEntry, origin, level };

    this.ngZone.runOutsideAngular(() => {
      // tslint:disable-next-line: no-non-null-assertion
      this.http
        .post<void>(storeUrl, httpLogEntry)
        .pipe(retryWithDelay(retryOptions.maxRetries, retryOptions.delayMs))
        .subscribe();
    });
  }
}
```

This `driver` receives a `HttpClient`, a `NgZone` for optimizations purpose and a custom configuration object that extends the `LogDriverConfig`.

```typescript
export interface HttpDriverConfig extends LogDriverConfig {
  /**
   *
   * The identifier of the app who emitted the log.
   * This is used to organize logs on the log store.
   *
   */
  origin: string;
  /**
   *
   * The url of the log store endpoint.
   *
   * The endpoint matching this url MUST support the POST method.
   */
  storeUrl: string;
  /**
   *
   * The desired retry behavior options on failed requests
   *
   */
  retryOptions: { maxRetries: number; delayMs: number };
}
```

The `sendLog` method has been optimized to run outside **Angular**'s `NgZone`, avoiding unnecessary change detection cycles.

### `HttpDriverModule`

The `HttpDriverModule` is very similar to the `ConsoleDriverModule`, however now we have a `withOptions()` factory function that allows us to provide the `HttpDriverConfig` partially and to fall down to the defined defaults.

```typescript
@NgModule()
export class HttpDriverModule {
  /**
   * Pass a full HTTP driver configuration.
   */
  static forRoot(config: HttpDriverConfig): ModuleWithProviders<HttpDriverRootModule> {
    return {
      ngModule: HttpDriverRootModule,
      providers: [
        {
          provide: httpDriverConfigToken,
          useValue: config,
        },
      ],
    };
  }

  /**
   * Pass options exclusive to the HTTP driver configuration, but fall back on
   * the log driver config for common options.
   */
  static withOptions(options: HttpDriverOptions): ModuleWithProviders<HttpDriverRootModule> {
    return {
      ngModule: HttpDriverRootModule,
      providers: [
        {
          provide: HttpDriverConfigToken,
          useValue: options,
        },
      ],
    };
  }

  constructor() {
    throw new Error('Do not import HttpDriverModule directly. Use HttpDriverModule.forRoot.');
  }
}
```

The `HttpDriverRootModule` has more interesting behavior.

```typescript
export function httpDriverFactory(
  http: HttpClient,
  logDriverConfig: LogDriverConfig,
  httpDriverConfig: HttpDriverConfig,
  ngZone: NgZone
): HttpDriver {
  const config: HttpDriverConfig = {
    ...logDriverConfig,
    ...httpDriverConfig,
  };

  return new HttpDriver(http, config, ngZone);
}

@NgModule({
  imports: [HttpClientModule],
  providers: [
    {
      deps: [HttpClient, logDriverConfigToken, httpDriverConfigToken, NgZone],
      multi: true,
      provide: logDriverToken,
      useFactory: httpDriverFactory,
    },
  ],
})
export class HttpDriverRootModule {
  constructor(
    // tslint:disable: no-any no-null-keyword
    @Optional()
    @SkipSelf()
    @Inject(HttpDriverRootModule)
    maybeNgModuleFromParentInjector: HttpDriverRootModule = null as any
    // tslint:enable: no-any no-null-keyword
  ) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'HttpDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
```

We now have the `deps` property, needed to inject the dependencies. In this case the `HttpClient`, the `ngZone`, the `logDriverConfigToken` and the `httpDriverConfigToken`.

This dependencies are used in the `httpDriverFactory` function.
There, we merge the `logDriverConfig` and `httpDriverConfig` to ensure we have the default configurations, in they are not override, and we return a new instance of the `HttpDriver`.

The usage is also very similar.

```typescript
@NgModule({
  ...,
  imports: [
    ...,
    LumberjackModule.forRoot(),
    ConsoleDriverModule.forRoot(),
    HttpDriverModule.forRoot({
      levels: [LumberjackLogLevel.Error],
      origin: 'ForestApp',
      storeUrl: '/api/logs',
      retryOptions: { maxRetries: 5, delayMs: 250 },
    }),
    ...
  ],
  ...
})
export class AppModule {}
```

Only this time we are passing our custom configuration object.
