import { ModuleWithProviders, NgModule } from '@angular/core';

import { defaultLogConfig } from './configs/default-log.config';
import { defaultLogDriverConfig, LogDriverConfigToken } from './configs/log-driver.config';
import { LumberjackLogConfig, LumberjackLogConfigToken } from './configs/lumberjack-log.config';
import { LumberjackRootModule } from './lumberjack-root.module';

@NgModule()
export class LumberjackModule {
  static forRoot(config: LumberjackLogConfig = defaultLogConfig): ModuleWithProviders<LumberjackRootModule> {
    return {
      ngModule: LumberjackRootModule,
      providers: [
        {
          provide: LumberjackLogConfigToken,
          useValue: config,
        },
      ],
    };
  }

  constructor() {
    throw new Error('Do not import LumberjackModule directly. Use LumberjackModule.forRoot.');
  }
}
