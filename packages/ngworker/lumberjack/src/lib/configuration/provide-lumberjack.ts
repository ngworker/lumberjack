import { Provider } from '@angular/core';

import { isProductionEnvironmentToken } from '../environment/is-production-environment.token';
import { lumberjackFormatLog } from '../formatting/lumberjack-format-log';
import { LumberjackLogFormatter } from '../formatting/lumberjack-log-formatter.service';
import { LumberjackLogDriverLogger } from '../log-drivers/lumberjack-log-driver-logger';
import { LumberjackLogFactory } from '../logging/lumberjack-log-factory';
import { LumberjackService } from '../logging/lumberjack.service';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

import { defaultDevelopmentLevels } from './default-development-levels';
import { defaultProductionLevels } from './default-production-levels';
import { lumberjackConfigToken } from './lumberjack-config.token';
import { lumberjackLogDriverConfigToken } from './lumberjack-log-driver-config.token';
import { LumberjackLogDriverConfig } from './lumberjack-log-driver.config';
import { lumberjackOptionsToken } from './lumberjack-options.token';
import { LumberjackConfig } from './lumberjack.config';
import { LumberjackOptions } from './lumberjack.options';

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
    LumberjackLogFormatter,
    LumberjackLogDriverLogger,
    LumberjackLogFactory,
    LumberjackTimeService,
  ];
}
