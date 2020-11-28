import { Inject, NgModule, Optional, SkipSelf } from '@angular/core';

import { defaultDevelopmentLevels } from './configs/default-development-levels';
import { defaultProductionLevels } from './configs/default-production-levels';
import { logDriverConfigToken } from './configs/log-driver-config.token';
import { LogDriverConfig } from './configs/log-driver.config';
import { lumberjackLogConfigToken } from './configs/lumberjack-log-config.token';
import { lumberjackLogOptionsToken } from './configs/lumberjack-log-options.token';
import { LumberjackLogConfig } from './configs/lumberjack-log.config';
import { LumberjackLogOptions } from './configs/lumberjack-log.options';
import { isProductionEnvironmentToken } from './environment/is-production-environment.token';
import { lumberjackFormat } from './formatting/lumberjack-format';

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

export function logDriverConfigFactory({ levels }: LumberjackLogConfig): LogDriverConfig {
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
      provide: logDriverConfigToken,
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
