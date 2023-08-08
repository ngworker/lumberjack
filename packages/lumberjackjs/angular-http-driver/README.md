# LumberjackAngularHttpDriver

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

The rest of the `LumberjackAngularHttpDriver` is defined as follows

```typescript
@Injectable()
export class LumberjackAngularHttpDriver<TPayload extends LumberjackLogPayload | void = void>
  implements LumberjackLogDriver<TPayload>, OnDestroy
{
  static readonly driverIdentifier = 'LumberjackAngularHttpDriver';

  readonly #http = inject(HttpClient);
  readonly #ngZone = inject(NgZone);
  readonly #subscriptions = new Subscription();

  readonly config = inject(LumberjackAngularHttpDriverConfigToken);

  ngOnDestroy(): void {
    this.#subscriptions.unsubscribe();
  }

  logCritical({ formattedLog, log }: LumberjackLogDriverLog<TPayload>): void {
    this.#sendLog(formattedLog, log);
  }

  logDebug({ formattedLog, log }: LumberjackLogDriverLog<TPayload>): void {
    this.#sendLog(formattedLog, log);
  }

  logError({ formattedLog, log }: LumberjackLogDriverLog<TPayload>): void {
    this.#sendLog(formattedLog, log);
  }

  logInfo({ formattedLog, log }: LumberjackLogDriverLog<TPayload>): void {
    this.#sendLog(formattedLog, log);
  }

  logTrace({ formattedLog, log }: LumberjackLogDriverLog<TPayload>): void {
    this.#sendLog(formattedLog, log);
  }

  logWarning({ formattedLog, log }: LumberjackLogDriverLog<TPayload>): void {
    this.#sendLog(formattedLog, log);
  }

  #sendLog(formattedLog: string, log: LumberjackLog<TPayload>): void {
    const { origin, retryOptions, storeUrl } = this.config;
    const httpLog: LumberjackHttpLog<TPayload> = { formattedLog, origin, log };

    this.ngZone.runOutsideAngular(() => {
      this.#subscriptions.add(
        this.#http
          .post<void>(storeUrl, httpLog)
          .pipe(retryWithDelay(retryOptions.maxRetries, retryOptions.delayMs))
          // HTTP requests complete after the response is received, so there's no need to unsubscribe.
          .subscribe(() => {
            // No-op
          })
      );
    });
  }
}
```

The HTTP log driver receives an `HttpClient`, an `NgZone` for optimizations purpose, and a custom configuration object that extends the `LumberjackLogDriverConfig`.

```typescript
export interface LumberjackAngularHttpDriverConfig extends LumberjackLogDriverConfig {
  /**
   * The identifier of the app which emitted the log.
   * This is used to organize logs on the log store.
   */
  readonly origin: string;
  /**
   * The desired retry behavior options on failed requests.
   */
  readonly retryOptions: LumberjackAngularHttpDriverRetryOptions;
  /**
   * The url of the log store endpoint.
   *
   * The endpoint matching this url MUST support the POST method.
   */
  readonly storeUrl: string;
}

export interface LumberjackAngularHttpDriverRetryOptions {
  readonly delayMs: number;
  readonly maxRetries: number;
}
```

The `sendLog` method has been optimized to run outside Angular's `NgZone`, avoiding unnecessary change detection cycles.

### LumberjackAngularHttpDriverModule

Novelty appears with the static `withOptions` function that allows us to pass `LumberjackAngularHttpDriverOptions` to fall back to the settings in `LumberjackLogDriverConfig`.

Additionally, we can configure the underlaying `HttpClient` by passing any features it receives like interceptors.

```typescript
@NgModule()
export class LumberjackAngularHttpDriverModule {
  /**
   * Configure and register the HTTP driver, including settings that log drivers
   * have in common.
   *
   * @param config Settings used by the HTTP driver.
   */
  static forRoot(
    config: LumberjackAngularHttpDriverConfig,
    ...features: HttpClientFeatures
  ): ModuleWithProviders<LumberjackAngularHttpDriverRootModule> {
    return {
      ngModule: LumberjackAngularHttpDriverRootModule,
      providers: [provideLumberjackAngularHttpDriver(withHttpConfig(config), ...features)],
    };
  }

  /**
   * Configure and register the HTTP driver, but fall back on the default log
   * driver settings for settings that log drivers have in common.
   * @param options Settings used by the HTTP driver.
   */
  static withOptions(
    options: LumberjackAngularHttpDriverOptions,
    ...features: HttpClientFeatures
  ): ModuleWithProviders<LumberjackAngularHttpDriverRootModule> {
    return {
      ngModule: LumberjackAngularHttpDriverRootModule,
      providers: [provideLumberjackAngularHttpDriver(withHttpOptions(options), ...features)],
    };
  }

  constructor() {
    throw new Error(
      'Do not import LumberjackAngularHttpDriverModule directly. Use LumberjackAngularHttpDriverModule.forRoot.'
    );
  }
}
```

The most interesting behavior exist on the `provideLumberjackAngularHttpDriver` function

```typescript
export type LumberjackAngularHttpDriverConfigurationKind = 'options' | 'config';
export type LumberjackAngularHttpDriverConfiguration<Kind extends LumberjackAngularHttpDriverConfigurationKind> = {
  kind: Kind;
  providers: EnvironmentProviders;
};

function makeLumberjackHttpConfiguration<Kind extends LumberjackAngularHttpDriverConfigurationKind>(
  kind: Kind,
  providers: Provider[]
): LumberjackAngularHttpDriverConfiguration<Kind> {
  return {
    kind,
    providers: makeEnvironmentProviders(providers),
  };
}

export function withHttpConfig(
  config: LumberjackAngularHttpDriverConfig
): LumberjackAngularHttpDriverConfiguration<'config'> {
  return makeLumberjackHttpConfiguration('config', [
    {
      provide: LumberjackAngularHttpDriverConfigToken,
      deps: [lumberjackLogDriverConfigToken],
      useFactory: (logDriverConfig: LumberjackLogDriverConfig): LumberjackAngularHttpDriverInternalConfig => ({
        ...logDriverConfig,
        identifier: LumberjackAngularHttpDriver.driverIdentifier,
        ...config,
      }),
    },
  ]);
}

export function withHttpOptions(
  options: LumberjackAngularHttpDriverOptions
): LumberjackAngularHttpDriverConfiguration<'options'> {
  return makeLumberjackHttpConfiguration('options', [
    {
      provide: LumberjackAngularHttpDriverConfigToken,
      deps: [lumberjackLogDriverConfigToken],
      useFactory: (logDriverConfig: LumberjackLogDriverConfig): LumberjackAngularHttpDriverInternalConfig => ({
        ...logDriverConfig,
        identifier: LumberjackAngularHttpDriver.driverIdentifier,
        ...options,
      }),
    },
  ]);
}

export type HttpClientFeatures = Parameters<typeof provideHttpClient>;

export function provideLumberjackAngularHttpDriver<Kind extends LumberjackAngularHttpDriverConfigurationKind>(
  configuration: LumberjackAngularHttpDriverConfiguration<Kind>,
  ...features: HttpClientFeatures
): EnvironmentProviders[] {
  return [
    provideHttpClient(...features),
    makeEnvironmentProviders([LumberjackAngularHttpDriverProvider]),
    configuration.providers,
  ];
}
```

This is our Standalone API, ready for everyone using Angular >v14.

This is where the heaviest configuration happens and it is used to boost the classic APIs

The following is an example of how both API can be used

Classic:

```typescript
@NgModule({
  ...,
  imports: [
    ...,
    LumberjackModule.forRoot(),
    LumberjackAngularHttpDriverModule.forRoot({
      levels: [LumberjackLevel.Error],
      origin: 'ForestApp',
      retryOptions: { maxRetries: 5, delayMs: 250 },
      storeUrl: '/api/logs',
    },
      withInterceptors([
        (req, next) => {
          const easy = inject(easyToken);
          console.log('are interceptors working?', easy);
          return next(req);
        },
      ])
    ),
    ...
  ],
  ...
})
export class AppModule {}
```

or

```typescript
@NgModule({
  ...,
  providers: [
    ...,
    provideLumberjack(), provideLumberjackAngularHttpDriver(withHttpConfig({
      levels: [LumberjackLeve
```
