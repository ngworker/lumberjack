import { ModuleWithProviders, NgModule } from '@angular/core';

import { LumberjackLogConfig, LumberjackLogConfigToken } from './configs/lumberjack-log.config';
import { LumberjackRootModule } from './lumberjack-root.module';

@NgModule()
export class LumberjackModule {
  static forRoot(config?: LumberjackLogConfig): ModuleWithProviders<LumberjackRootModule> {
    return {
      ngModule: LumberjackRootModule,
      providers: (config && [{ provide: LumberjackLogConfigToken, useValue: config }]) || [],
    };
  }

  constructor() {
    throw new Error('Do not import LumberjackModule directly. Use LumberjackModule.forRoot.');
  }
}
