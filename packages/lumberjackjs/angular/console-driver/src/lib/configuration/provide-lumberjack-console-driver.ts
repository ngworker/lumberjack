import { Provider } from '@angular/core';

import { lumberjackLogDriverConfigToken, lumberjackLogDriverToken } from '@lumberjackjs/angular';
import { LumberjackLogDriverConfig } from '@lumberjackjs/core';

import { LumberjackConsoleDriver } from '../log-drivers/lumberjack-console.driver';

import { lumberjackConsoleDriverConfigToken } from './lumberjack-console-driver-config.token';
import { LumberjackConsoleDriverConfig } from './lumberjack-console-driver.config';

/**
 * Returns the [dependency-injection providers](https://angular.io/guide/glossary#provider)
 *
 * for the `LumberjackConsoleDriver` and its `LumberjackConsoleDriverConfig`.
 * @usageNotes
 *
 * The function is useful when you want to bootstrap an application using
 * the `bootstrapApplication` function and want to make available the `LumberjackConsoleDriver` providers.
 *
 * ```typescript
 * bootstrapApplication(RootComponent, {
 *   providers: [
 *    provideLumberjack({...}),
 *    provideLumberjackConsoleDriver({...})
 *   ]
 * });
 * ```
 *
 * @publicApi
 */
export function provideLumberjackConsoleDriver(config: Partial<LumberjackConsoleDriverConfig> = {}): Provider[] {
  return [
    {
      provide: lumberjackConsoleDriverConfigToken,
      deps: [lumberjackLogDriverConfigToken],
      useFactory: (logDriverConfig: LumberjackLogDriverConfig): LumberjackConsoleDriverConfig => ({
        ...logDriverConfig,
        identifier: LumberjackConsoleDriver.driverIdentifier,
        ...config,
      }),
    },
    {
      provide: lumberjackLogDriverToken,
      useClass: LumberjackConsoleDriver,
      multi: true,
    },
  ];
}
