import { Provider } from '@angular/core';

import {
  createLumberjackConfig,
  LumberjackConfig,
  LumberjackDriverConfig,
  LumberjackOptions,
} from '@lumberjackjs/core';

import { isProductionEnvironmentToken } from '../environment/is-production-environment.token';
import { LumberjackService } from '../logging/lumberjack.service';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

import { lumberjackConfigToken } from './lumberjack-config.token';
import { lumberjackDriverConfigToken } from './lumberjack-driver-config.token';
import { lumberjackOptionsToken } from './lumberjack-options.token';

export function createLumberjackDriverConfig({ levels }: LumberjackConfig): Omit<LumberjackDriverConfig, 'identifier'> {
  return {
    levels,
  };
}

/**
 * Returns the [dependency-injection providers](https://angular.io/guide/glossary#provider)
 * for the `LumberjackOptions`, `LumberjackConfig` and `LumberjackDriverConfig`.
 *
 * @usageNotes
 *
 * The function is useful when you want to bootstrap an application using
 * the `bootstrapApplication` function and want to make available the `Lumberjack` providers.
 *
 * ```typescript
 * bootstrapApplication(RootComponent, {
 *   providers: [
 *    provideLumberjack({...})
 *   ]
 * });
 * ```
 *
 * @publicApi
 */
export function provideLumberjack(options?: LumberjackOptions): Provider[] {
  return [
    { provide: lumberjackOptionsToken, useValue: options },
    {
      deps: [isProductionEnvironmentToken],
      provide: lumberjackConfigToken,
      useFactory: (isProductionEnvironment: boolean) => createLumberjackConfig(isProductionEnvironment, options),
    },
    {
      deps: [lumberjackConfigToken],
      provide: lumberjackDriverConfigToken,
      useFactory: createLumberjackDriverConfig,
    },
    { provide: LumberjackService, useClass: LumberjackService },
    LumberjackTimeService,
  ];
}
