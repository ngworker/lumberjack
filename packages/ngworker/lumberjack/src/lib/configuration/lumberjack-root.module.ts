import { inject, NgModule } from '@angular/core';
import {
  defaultDevelopmentLevels,
  defaultProductionLevels,
  LumberjackConfig,
  lumberjackFormatLog,
  LumberjackLogDriverConfig,
  LumberjackOptions,
} from '@webworkers/lumberjack';

import { isProductionEnvironmentToken } from '../environment/is-production-environment.token';
import { LumberjackLogFormatter } from '../formatting/lumberjack-log-formatter.service';
import { LumberjackLogDriverLogger } from '../log-drivers/lumberjack-log-driver-logger';
import { LumberjackLogFactory } from '../logging/lumberjack-log-factory';
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
 * Do not import directly. Use `LumberjackModule.forRoot`.
 */
@NgModule({
  providers: [
    {
      deps: [isProductionEnvironmentToken, lumberjackOptionsToken],
      provide: lumberjackConfigToken,
      useFactory: configFactory,
    },
    {
      deps: [lumberjackConfigToken],
      provide: lumberjackLogDriverConfigToken,
      useFactory: logDriverConfigFactory,
    },
    LumberjackLogDriverLogger,
    LumberjackLogFactory,
    LumberjackLogFormatter,
    LumberjackService,
    LumberjackTimeService,
  ],
})
export class LumberjackRootModule {
  private readonly maybeNgModuleFromParentInjector = inject(LumberjackRootModule, {
    optional: true,
    skipSelf: true,
  });

  constructor() {
    if (this.maybeNgModuleFromParentInjector) {
      throw new Error(
        'LumberjackModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
