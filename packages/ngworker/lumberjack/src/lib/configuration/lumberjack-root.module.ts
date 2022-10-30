import { Inject, NgModule, Optional, SkipSelf } from '@angular/core';

import { isProductionEnvironmentToken } from '../environment/is-production-environment.token';
import { lumberjackFormatLog } from '../formatting/lumberjack-format-log';

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
  ],
})
export class LumberjackRootModule {
  constructor(
    @Optional()
    @SkipSelf()
    @Inject(LumberjackRootModule)
    private maybeNgModuleFromParentInjector: LumberjackRootModule
  ) {
    if (this.maybeNgModuleFromParentInjector) {
      throw new Error(
        'LumberjackModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
