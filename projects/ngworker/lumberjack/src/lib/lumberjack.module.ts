import { ModuleWithProviders, NgModule } from '@angular/core';

import { defaultLogConfig } from './configs/default-log.config';
import { defaultLogDriverConfig, LogDriverConfigToken } from './configs/log-driver.config';
import { LumberjackLogConfig, LumberjackLogConfigToken } from './configs/lumberjack-log.config';

@NgModule()
export class LumberjackModule {
  static forRoot(config: LumberjackLogConfig = defaultLogConfig): ModuleWithProviders<LumberjackModule> {
    return {
      ngModule: LumberjackModule,
      providers: [
        {
          provide: LumberjackLogConfigToken,
          useValue: config,
        },
        {
          provide: LogDriverConfigToken,
          useValue: defaultLogDriverConfig,
        },
      ],
    };
  }
}
