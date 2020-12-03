# HttpDriver

This `driver` is used to send an **HTTP** request to a configured **Log Store** server.

Take this implementation as an advanced example of a `driver` implementation. Some of the decisions made are not compatible with every existing **Log Store**.

If more than one **Log Store** is supported, or multiple endpoints for the same **Log Store** are used; one `HttpDriverModule` **SHOULD** be configured per **Log Store**/**Log Endpoint**.

## Implementation

The following are complementary interfaces for the `driver` implementation.

```typescript
interface LumberjackHttpLog {
  formattedLog: string;
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

  logCritical(formattedLog: string): void {
    this.sendLog(formattedLog, LumberjackLevel.Critical);
  }

  logDebug(formattedLog: string): void {
    this.sendLog(formattedLog, LumberjackLevel.Debug);
  }

  logError(formattedLog: string): void {
    this.sendLog(formattedLog, LumberjackLevel.Error);
  }

  logInfo(formattedLog: string): void {
    this.sendLog(formattedLog, LumberjackLevel.Info);
  }

  logTrace(formattedLog: string): void {
    this.sendLog(formattedLog, LumberjackLevel.Trace);
  }

  logWarning(formattedLog: string): void {
    this.sendLog(formattedLog, LumberjackLevel.Warning);
  }

  private sendLog(formattedLog: string, logLevel: LumberjackLogLevel): void {
    const { origin, retryOptions, storeUrl } = this.config;
    const httpLog: HttpLogEntry = { log, level: logLevel, origin };

    this.ngZone.runOutsideAngular(() => {
      // tslint:disable-next-line: no-non-null-assertion
      this.http
        .post<void>(storeUrl, httpLog)
        .pipe(retryWithDelay(retryOptions.maxRetries, retryOptions.delayMs))
        .subscribe();
    });
  }
}
```

This `driver` receives a `HttpClient`, a `NgZone` for optimizations purpose and a custom configuration object that extends the `LogDriverConfig`.

```typescript
export interface LumberjackHttpDriverConfig extends LumberjackLogDriverConfig {
  /**
   *
   * The identifier of the app who emitted the log.
   * This is used to organize logs on the log store.
   *
   */
  readonly origin: string;
  /**
   *
   * The desired retry behavior options on failed requests
   *
   */
  readonly retryOptions: LumberjackHttpDriverRetryOptions;
  /**
   *
   * The url of the log store endpoint.
   *
   * The endpoint matching this url MUST support the POST method.
   */
  readonly storeUrl: string;
}

export interface LumberjackHttpDriverRetryOptions {
  readonly maxRetries: number;
  readonly delayMs: number;
}
```

The `sendLog` method has been optimized to run outside **Angular**'s `NgZone`, avoiding unnecessary change detection cycles.

### `LumberjackHttpDriverModule`

The `LumberjackHttpDriverModule` is very similar to the `LumberjackConsoleDriverModule`, however now we have a `withOptions()` factory function that allows us to provide the `LumberjackHttpDriverConfig` partially and to fall down to the defined defaults.

```typescript
@NgModule()
export class LumberjackHttpDriverModule {
  /**
   * Pass a full HTTP driver configuration.
   */
  static forRoot(config: LumberjackHttpDriverConfig): ModuleWithProviders<LumberjackHttpDriverRootModule> {
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
  static withOptions(options: LumberjackHttpDriverOptions): ModuleWithProviders<LumberjackHttpDriverRootModule> {
    return {
      ngModule: LumberjackHttpDriverRootModule,
      providers: [
        {
          provide: LumberjackHttpDriverConfigToken,
          useValue: options,
        },
      ],
    };
  }

  constructor() {
    throw new Error('Do not import LumberjackHttpDriverModule directly. Use LumberjackHttpDriverModule.forRoot.');
  }
}
```

The `LumberjackHttpDriverRootModule` has more interesting behavior.

```typescript
export function httpDriverFactory(
  http: HttpClient,
  logDriverConfig: LogDriverConfig,
  httpDriverConfig: LumberjackHttpDriverConfig,
  ngZone: NgZone
): LumberjackHttpDriver {
  const config: LumberjackHttpDriverConfig = {
    ...logDriverConfig,
    ...httpDriverConfig,
  };

  return new LumberjackHttpDriver(http, config, ngZone);
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
export class LumberjackHttpDriverRootModule {
  constructor(
    // tslint:disable: no-any no-null-keyword
    @Optional()
    @SkipSelf()
    @Inject(LumberjackHttpDriverRootModule)
    maybeNgModuleFromParentInjector: LumberjackHttpDriverRootModule = null as any
    // tslint:enable: no-any no-null-keyword
  ) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'LumberjackHttpDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
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
    LumberjackConsoleDriverModule.forRoot(),
    LumberjackHttpDriverModule.forRoot({
      levels: [LumberjackLevel.Error],
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
