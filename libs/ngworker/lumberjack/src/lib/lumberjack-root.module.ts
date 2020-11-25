import { Inject, NgModule, Optional, SkipSelf } from '@angular/core';

import { defaultDevelopmentLevels } from './configs/default-development-levels';
import { defaultProductionLevels } from './configs/default-production-levels';
import { LogDriverConfig, logDriverConfigToken } from './configs/log-driver.config';
import { lumberjackLogConfigToken } from './configs/lumberjack-log-config.token';
import { lumberjackLogOptionsToken } from './configs/lumberjack-log-options.token';
import { LumberjackLogConfig } from './configs/lumberjack-log.config';
import { LumberjackLogOptions } from './configs/lumberjack-log.options';
import { isProductionEnvironmentToken } from './environment/is-production-environment.token';
import { createDefaultFormatFn } from './formatting/create-default-format-fn';
import { LumberjackTimeService } from './time/lumberjack-time.service';

export function logConfigFactory(
  options: LumberjackLogOptions = {},
  isProductionEnvironment: boolean,
  time: LumberjackTimeService
): LumberjackLogConfig {
  return {
    format: createDefaultFormatFn(time),
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
      deps: [lumberjackLogOptionsToken, isProductionEnvironmentToken, LumberjackTimeService],
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
