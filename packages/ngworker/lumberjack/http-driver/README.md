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
export class LumberjackHttpDriver<TPayload extends LumberjackLogPayload | void = void>
  implements LumberjackLogDriver<TPayload>, OnDestroy
{
  static readonly driverIdentifier = 'LumberjackHttpDriver';

  readonly #http = inject(HttpClient);
  readonly #ngZone = inject(NgZone);
  readonly #subscriptions = new Subscription();

  readonly config = inject(lumberjackHttpDriverConfigToken);

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

  private #sendLog(formattedLog: string, log: LumberjackLog<TPayload>): void {
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

### provideLumberjackHttpDriver

The `provideLumberjackHttpDriver` is similar to the `provideLumberjackConsoleDriver`.

Novelty appears with the `withHttpOptions` and `withHttpConfig` functions that allow to allow to configure the driver.

Additionally, we can configure the underlaying `HttpClient` by passing any features it receives like interceptors.

```typescript
export type LumberjackHttpDriverConfigurationKind = 'options' | 'config';
export type LumberjackHttpDriverConfiguration<Kind extends LumberjackHttpDriverConfigurationKind> = {
  kind: Kind;
  providers: EnvironmentProviders;
};

function makeLumberjackHttpConfiguration<Kind extends LumberjackHttpDriverConfigurationKind>(
  kind: Kind,
  providers: Provider[]
): LumberjackHttpDriverConfiguration<Kind> {
  return {
    kind,
    providers: makeEnvironmentProviders(providers),
  };
}

export function withHttpConfig(config: LumberjackHttpDriverConfig): LumberjackHttpDriverConfiguration<'config'> {
  return makeLumberjackHttpConfiguration('config', [
    {
      provide: lumberjackHttpDriverConfigToken,
      deps: [lumberjackLogDriverConfigToken],
      useFactory: (logDriverConfig: LumberjackLogDriverConfig): LumberjackHttpDriverInternalConfig => ({
        ...logDriverConfig,
        identifier: LumberjackHttpDriver.driverIdentifier,
        ...config,
      }),
    },
  ]);
}

export function withHttpOptions(options: LumberjackHttpDriverOptions): LumberjackHttpDriverConfiguration<'options'> {
  return makeLumberjackHttpConfiguration('options', [
    {
      provide: lumberjackHttpDriverConfigToken,
      deps: [lumberjackLogDriverConfigToken],
      useFactory: (logDriverConfig: LumberjackLogDriverConfig): LumberjackHttpDriverInternalConfig => ({
        ...logDriverConfig,
        identifier: LumberjackHttpDriver.driverIdentifier,
        ...options,
      }),
    },
  ]);
}

export type HttpClientFeatures = Parameters<typeof provideHttpClient>;

export function provideLumberjackHttpDriver<Kind extends LumberjackHttpDriverConfigurationKind>(
  configuration: LumberjackHttpDriverConfiguration<Kind>,
  ...features: HttpClientFeatures
): EnvironmentProviders[] {
  return [
    provideHttpClient(...features),
    makeEnvironmentProviders([lumberjackHttpDriverProvider]),
    configuration.providers,
  ];
}
```

The following is an example of how both API can be used

```typescript
bootstrapApplication(AppComponent, {
  providers: [
    provideLumberjack(),
    provideLumberjackConsoleDriver(),
    provideLumberjackHttpDriver(
      withHttpOptions({
        origin: 'ForestApp',
        retryOptions: { maxRetries: 1, delayMs: 250 },
        storeUrl: '/api/logs',
      }),
      withInterceptors([
        (req, next) => {
          const easy = inject(easyToken);
          console.log('are interceptors working?', easy);
          return next(req);
        },
      ])
    ),
```
