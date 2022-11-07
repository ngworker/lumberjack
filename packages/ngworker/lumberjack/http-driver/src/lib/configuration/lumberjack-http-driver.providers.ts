import { Provider } from '@angular/core';

import {
  LumberjackLogDriverConfig,
  lumberjackLogDriverConfigToken,
  lumberjackLogDriverToken,
} from '@ngworker/lumberjack';

import { LumberjackHttpDriver } from '../log-drivers/lumberjack-http.driver';

import { lumberjackHttpDriverConfigToken } from './lumberjack-http-driver-config.token';
import { LumberjackHttpDriverInternalConfig } from './lumberjack-http-driver-internal.config';
import { LumberjackHttpDriverConfig } from './lumberjack-http-driver.config';
import { LumberjackHttpDriverOptions } from './lumberjack-http-driver.options';

export const HTTP_PROVIDER: Provider = {
  provide: lumberjackLogDriverToken,
  useClass: LumberjackHttpDriver,
  multi: true,
};

/**
 * Returns the [dependency-injection providers](https://angular.io/guide/glossary#provider)
 *
 * for the `LumberjackHttpDriver` and its `LumberjackHttpDriverConfig`.
 * @usageNotes
 *
 * The function is useful when you want to bootstrap an application using
 * the `bootstrapApplication` function and want to make available the `LumberjackHttpDriver` providers.
 *
 * ```typescript
 * bootstrapApplication(RootComponent, {
 *   providers: [
 *    provideLumberjack({...}),
 *    provideLumberjackHttpDriver({...})
 *   ]
 * });
 * ```
 *
 * @publicApi
 */
export function provideLumberjackHttpDriver(config: LumberjackHttpDriverConfig): Provider[] {
  return [
    HTTP_PROVIDER,
    {
      provide: lumberjackHttpDriverConfigToken,
      deps: [lumberjackLogDriverConfigToken],
      useFactory: (logDriverConfig: LumberjackLogDriverConfig): LumberjackHttpDriverInternalConfig => ({
        ...logDriverConfig,
        identifier: LumberjackHttpDriver.driverIdentifier,
        ...config,
      }),
    },
  ];
}

/**
 * Returns the [dependency-injection providers](https://angular.io/guide/glossary#provider)
 *
 * for the `LumberjackHttpDriver` and its `LumberjackHttpDriverConfig` using the `LumberjackHttpDriverOptions`.
 * @usageNotes
 *
 * The function is useful when you want to bootstrap an application using
 * the `bootstrapApplication` function and want to make available the `LumberjackHttpDriver` providers using the `LumberjackHttpDriverOptions`.
 *
 * ```typescript
 * bootstrapApplication(RootComponent, {
 *   providers: [
 *    provideLumberjack({...}),
 *    provideLumberjackHttpDriverWithOptions({...})
 *   ]
 * });
 * ```
 *
 * @publicApi
 */
export function provideLumberjackHttpDriverWithOptions(options: LumberjackHttpDriverOptions): Provider[] {
  return [
    HTTP_PROVIDER,
    {
      provide: lumberjackHttpDriverConfigToken,
      deps: [lumberjackLogDriverConfigToken],
      useFactory: (logDriverConfig: LumberjackLogDriverConfig): LumberjackHttpDriverInternalConfig => ({
        ...logDriverConfig,
        identifier: LumberjackHttpDriver.driverIdentifier,
        ...options,
      }),
    },
  ];
}
