import { Inject, NgModule, Optional, SkipSelf } from '@angular/core';

import { isProductionEnvironmentToken } from '../environment/is-production-environment.token';
import { lumberjackFormat } from '../formatting/lumberjack-format';

import { defaultDevelopmentLevels } from './default-development-levels';
import { defaultProductionLevels } from './default-production-levels';
import { lumberjackConfigToken } from './lumberjack-config.token';
import { lumberjackLogDriverConfigToken } from './lumberjack-log-driver-config.token';
import { LumberjackLogDriverConfig } from './lumberjack-log-driver.config';
import { lumberjackOptionsToken } from './lumberjack-options.token';
import { LumberjackConfig } from './lumberjack.config';
import { LumberjackOptions } from './lumberjack.options';

export function configFactory(options: LumberjackOptions = {}, isProductionEnvironment: boolean): LumberjackConfig {
  return {
    format: lumberjackFormat,
    levels: isProductionEnvironment ? defaultProductionLevels : defaultDevelopmentLevels,
    ...options,
  };
}

export function logDriverConfigFactory({ levels }: LumberjackConfig): LumberjackLogDriverConfig {
  return {
    levels,
  };
}

@NgModule({
  providers: [
    {
      deps: [lumberjackOptionsToken, isProductionEnvironmentToken],
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
    maybeNgModuleFromParentInjector: LumberjackRootModule
  ) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'LumberjackModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
