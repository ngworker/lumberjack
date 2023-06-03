import { Provider } from '@angular/core';

import {
  defaultDevelopmentLevels,
  defaultProductionLevels,
  LumberjackConfig,
  lumberjackFormatLog,
  LumberjackLogDriverConfig,
  LumberjackOptions,
} from '@webworker/lumberjack';

import { isProductionEnvironmentToken } from '../environment/is-production-environment.token';
import { LumberjackLogFormatterService } from '../formatting/lumberjack-log-formatter.service';
import { LumberjackService } from '../logging/lumberjack.service';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

import { lumberjackConfigToken } from './lumberjack-config.token';
import { lumberjackLogDriverConfigToken } from './lumberjack-log-driver-config.token';
import { lumberjackOptionsToken } from './lumberjack-options.token';

export function configFactory(isProductionEnvironment: boolean, options: LumberjackOptions = {}): LumberjackConfig {
  return {
    format: lumberjackFormatLog,
    levels: isProductionEnvironment ? defaultProductionLevels : defaultDevelopmentLevels,
    ...options,
  };
}

export function logDriverConfigFactory({ levels }: LumberjackConfig): Omit<LumberjackLogDriverConfig, 'identifier'> {
  return {
    levels,
  };
}

/**
 * Returns the [dependency-injection providers](https://angular.io/guide/glossary#provider)
 * for the `LumberjackOptions`, `LumberjackConfig` and `LumberjackLogDriverConfig`.
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
      useFactory: (isProductionEnvironment: boolean) => configFactory(isProductionEnvironment, options),
    },
    {
      deps: [lumberjackConfigToken],
      provide: lumberjackLogDriverConfigToken,
      useFactory: logDriverConfigFactory,
    },
    { provide: LumberjackService, useClass: LumberjackService },
    LumberjackLogFormatterService,
    LumberjackTimeService,
  ];
}
