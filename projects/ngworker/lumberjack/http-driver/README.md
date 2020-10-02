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
}

interface HttpLogPackage {
  logWagon: HttpLogEntry[];
  origin: string;
}
```

The `HttpLogPackage` is the object sent to the **Log Store**. It is composed of a `HttpLogEntry` list and an origin. A list is used to prevent overloading the **Log Store** with individual **POST** calls per log entry.

The rest of the `HttpDriver` is defined as follows

```typescript
@Injectable()
export class HttpDriver implements LogDriver {
  logWagon: HttpLogEntry[] = [];

  constructor(
    private http: HttpClient,
    @Inject(HttpDriverConfigToken) public config: HttpDriverConfig,
    private ngZone: NgZone
  ) {}

  logInfo(logEntry: string): void {
    this.log(logEntry, LumberjackLogLevel.Info);
  }

  logDebug(logEntry: string): void {
    this.log(logEntry, LumberjackLogLevel.Debug);
  }

  logError(logEntry: string): void {
    this.log(logEntry, LumberjackLogLevel.Error);
  }

  logWarning(logEntry: string): void {
    this.log(logEntry, LumberjackLogLevel.Warning);
  }

  private log(logEntry: string, logLevel: LumberjackLogLevel): void {
    const { logWagonSize } = this.config;

    this.logWagon.push({ logEntry, level: logLevel });

    if (this.logWagon.length >= logWagonSize) {
      this.sendLogPackage()
        .pipe(tap(() => (this.logWagon = [])))
        .subscribe();
    }
  }

  private sendLogPackage(): Observable<void> {
    const { origin, storeUrl } = this.config;
    const logPackage: HttpLogPackage = { logWagon: this.logWagon, origin };

    const logPackageSent = new Subject<void>();
    const logPackageSent$ = logPackageSent.asObservable();

    this.ngZone.runOutsideAngular(() => {
      this.http
        .post<void>(storeUrl, logPackage)
        .pipe(
          tap(() => {
            logPackageSent.next();
            logPackageSent.complete();
          })
        )
        .subscribe();
    });

    return logPackageSent$;
  }
}
```

This `driver` receives a `HttpClient`, a `NgZone` for optimizations porpoise and a custom configuration object that extends the `LogDriverConfig`.

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
   * Defines the amount of log that should be written before sending them to the log store.
   *
   */
  logWagonSize: number;
}
```

### Log method

```typescript
private log(logEntry: string, logLevel: LumberjackLogLevel): void {
    const { logWagonSize } = this.config;

    this.logWagon.push({ logEntry, level: logLevel });

    if (this.logWagon.length >= logWagonSize) {
      this.sendLogPackage()
        .pipe(tap(() => (this.logWagon = [])))
        .subscribe();
    }
  }
```

The logic of the private `log` method is simple. It stores in an in-memory list the written logs until the configured `logWagonSize` is reached.

Then the logs are attempted to be send. On success we clear the list of pending logs, otherwise, we keep adding items until the server recovers.

The `sendLogPackage` method has been optimized to run outside **Angular**'s `NgZone`, avoiding unnecessary change detection cycles.

### `HttpDriverModule`

The `HttpDriverModule` is very similar to the `ConsoleDriverModule`

```typescript
@NgModule()
export class HttpDriverModule {
  static forRoot(config: HttpDriverConfig): ModuleWithProviders<HttpDriverRootModule> {
    return {
      ngModule: HttpDriverRootModule,
      providers: [
        {
          provide: HttpDriverConfigToken,
          useValue: config,
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
      deps: [HttpClient, LogDriverConfigToken, HttpDriverConfigToken, NgZone],
      multi: true,
      provide: LogDriverToken,
      useFactory: httpDriverFactory,
    },
  ],
})
export class HttpDriverRootModule {
  constructor(@Optional() @SkipSelf() maybeNgModuleFromParentInjector?: HttpDriverRootModule) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'HttpDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
```

We now have the `deps` property, needed to inject the dependencies. In this case the `HttpClient`, the `ngZone`, the `LogDriverConfigToken` and the `HttpDriverConfigToken`.

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
      origin: 'MyApp',
      storeUrl: environment.baseUrl,
      logWagonSize: 5
    }),
    ...
  ],
  ...
})
export class AppModule {}
```

Only this time we are passing our custom configuration object. Notice however that we are not passing the levels property, therefore all levels are supported (default).
