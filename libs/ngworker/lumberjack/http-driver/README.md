# LumberjackHttpDriver

This log driver is used to send an HTTP request to a configured log store server.

Take this implementation as an advanced example of a log driver implementation. Some of the decisions made are not compatible with every existing log store.

## Implementation

The following are complementary interfaces for the log driver implementation.

```typescript
interface LumberjackHttpLog {
  readonly formattedLog: string;
  readonly level: LumberjackLogLevel;
  readonly origin: string;
}
```

The `LumberjackHttpLog` is the object sent to the log store.

The rest of the `LumberjackHttpDriver` is defined as follows

```typescript
@Injectable()
export class HttpDriver implements LogDriver {
  constructor(
    private http: HttpClient,
    @Inject(lumberjackHttpDriverConfigToken) public config: LumberjackHttpDriverConfig,
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
    const httpLog: LumberjackHttpLog = { log, level: logLevel, origin };

    this.ngZone.runOutsideAngular(() => {
      this.http
        .post<void>(storeUrl, httpLog)
        .pipe(retryWithDelay(retryOptions.maxRetries, retryOptions.delayMs))
        .subscribe();
    });
  }
}
```

The HTTP log driver receives an `HttpClient`, an `NgZone` for optimizations purpose, and a custom configuration object that extends the `LumberjackLogDriverConfig`.

```typescript
export interface LumberjackHttpDriverConfig extends LumberjackLogDriverConfig {
  /**
   * The identifier of the app which emitted the log.
   * This is used to organize logs on the log store.
   */
  readonly origin: string;
  /**
   * The desired retry behavior options on failed requests.
   */
  readonly retryOptions: LumberjackHttpDriverRetryOptions;
  /**
   * The url of the log store endpoint.
   *
   * The endpoint matching this url MUST support the POST method.
   */
  readonly storeUrl: string;
}

export interface LumberjackHttpDriverRetryOptions {
  readonly delayMs: number;
  readonly maxRetries: number;
}
```

The `sendLog` method has been optimized to run outside Angular's `NgZone`, avoiding unnecessary change detection cycles.

### LumberjackHttpDriverModule

The `LumberjackHttpDriverModule` is very similar to the `LumberjackConsoleDriverModule`, however now we have a static `withOptions` function that allows us to pass `LumberjackHttpDriverOptions` to fall back to the settings in `LumberjackLogDriverConfig`.

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
  logDriverConfig: LumberjackLogDriverConfig,
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
      deps: [HttpClient, lumberjackLogDriverConfigToken, lumberjackHttpDriverConfigToken, NgZone],
      multi: true,
      provide: lumberjackLogDriverToken,
      useFactory: httpDriverFactory,
    },
  ],
})
export class LumberjackHttpDriverRootModule {
  constructor(
    @Optional()
    @SkipSelf()
    @Inject(LumberjackHttpDriverRootModule)
    maybeNgModuleFromParentInjector: LumberjackHttpDriverRootModule = null as any
  ) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'LumberjackHttpDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
```

We now have the `deps` property, needed to inject the dependencies. In this case the `HttpClient`, the `NgZone`, the `lumberjackLogDriverConfigToken` and the `lumberjackHttpDriverConfigToken`. These dependencies are used in the `httpDriverFactory` function. There, we merge `logDriverConfig` and `httpDriverConfig`and pass them to a new instance of `LumberjackHttpDriver`.

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
      retryOptions: { maxRetries: 5, delayMs: 250 },
      storeUrl: '/api/logs',
    }),
    ...
  ],
  ...
})
export class AppModule {}
```

Only this time we are passing our custom configuration object.
