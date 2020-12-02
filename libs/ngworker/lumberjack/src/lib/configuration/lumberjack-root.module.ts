import { Inject, NgModule, Optional, SkipSelf } from '@angular/core';

import { isProductionEnvironmentToken } from '../environment/is-production-environment.token';
import { lumberjackFormat } from '../formatting/lumberjack-format';

import { defaultDevelopmentLevels } from './default-development-levels';
import { defaultProductionLevels } from './default-production-levels';
import { lumberjackLogConfigToken } from './lumberjack-log-config.token';
import { lumberjackLogDriverConfigToken } from './lumberjack-log-driver-config.token';
import { LumberjackLogDriverConfig } from './lumberjack-log-driver.config';
import { lumberjackLogOptionsToken } from './lumberjack-log-options.token';
import { LumberjackLogConfig } from './lumberjack-log.config';
import { LumberjackLogOptions } from './lumberjack-log.options';

export function logConfigFactory(
  options: LumberjackLogOptions = {},
  isProductionEnvironment: boolean
): LumberjackLogConfig {
  return {
    format: lumberjackFormat,
    levels: isProductionEnvironment ? defaultProductionLevels : defaultDevelopmentLevels,
    ...options,
  };
}

export function logDriverConfigFactory({ levels }: LumberjackLogConfig): LumberjackLogDriverConfig {
  return {
    levels,
  };
}

@NgModule({
  providers: [
    {
      deps: [lumberjackLogOptionsToken, isProductionEnvironmentToken],
      provide: lumberjackLogConfigToken,
      useFactory: logConfigFactory,
    },
    {
      deps: [lumberjackLogConfigToken],
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
