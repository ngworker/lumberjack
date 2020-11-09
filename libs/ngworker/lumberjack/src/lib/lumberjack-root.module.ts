import { Inject, NgModule, Optional, SkipSelf } from '@angular/core';

import { LogDriverConfig, LogDriverConfigToken, LumberjackLogConfig, LumberjackLogConfigToken } from './configs';
import {
  defaultDevelopmentLevels,
  defaultProductionLevels,
  LumberjackLogOptions,
  LumberjackLogOptionsToken,
} from './configs/lumberjack-log.config';
import { isProductionEnvironmentToken } from './environment/is-production-environment.token';
import { LumberjackTimeService } from './time/lumberjack-time.service';

export function logConfigFactory(
  options: LumberjackLogOptions = {},
  isProductionEnvironment: boolean,
  time: LumberjackTimeService
): LumberjackLogConfig {
  return {
    format({ context, createdAt: timestamp, level, message }) {
      return `${level}  ${time.utcTimestampFor(timestamp)} ${context ? `[${context}]` : ''} ${message}`;
    },
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
      deps: [LumberjackLogOptionsToken, isProductionEnvironmentToken, LumberjackTimeService],
      provide: LumberjackLogConfigToken,
      useFactory: logConfigFactory,
    },
    {
      deps: [LumberjackLogConfigToken],
      provide: LogDriverConfigToken,
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
