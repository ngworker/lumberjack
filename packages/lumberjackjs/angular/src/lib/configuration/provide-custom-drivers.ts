import { Provider } from '@angular/core';

import { LumberjackLogDriver } from '@lumberjackjs/core';

import { lumberjackLogDriverToken } from '../log-drivers/lumberjack-log-driver.token';

/**
 * Returns the [dependency-injection providers](https://angular.io/guide/glossary#provider)
 *
 * for one or more custom/agnostic `LumberjackDriver` and its `LumberjackDriverConfig`.
 * @usageNotes
 *
 * The function is useful when you want to bootstrap an application using
 * the `bootstrapApplication` function and want to make available the `LumberjackDriver` providers.
 *
 * ```typescript
 * bootstrapApplication(RootComponent, {
 *   providers: [
 *    provideLumberjack({...}),
 *    provideLumberjackCustomDriver({...})
 *   ]
 * });
 * ```
 *
 * @publicApi
 */
export function provideLumberjackCustomDrivers<Driver extends LumberjackLogDriver>(driver: Driver): Provider[];
export function provideLumberjackCustomDrivers<Driver extends LumberjackLogDriver>(drivers: Driver[]): Provider[];

export function provideLumberjackCustomDrivers<Driver extends LumberjackLogDriver>(
  drivers: Driver | Driver[]
): Provider[] {
  if (Array.isArray(drivers)) {
    return drivers.map((driver) => ({
      provide: lumberjackLogDriverToken,
      useValue: driver,
      multi: true,
    }));
  }

  return [
    {
      provide: lumberjackLogDriverToken,
      useValue: drivers,
      multi: true,
    },
  ];
}
