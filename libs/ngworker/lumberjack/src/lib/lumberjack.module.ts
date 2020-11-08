import { ModuleWithProviders, NgModule } from '@angular/core';

import { LumberjackLogConfigToken, LumberjackLogOptions } from './configs/lumberjack-log.config';
import { LumberjackRootModule } from './lumberjack-root.module';

@NgModule()
export class LumberjackModule {
  static forRoot(options?: LumberjackLogOptions): ModuleWithProviders<LumberjackRootModule> {
    return {
      ngModule: LumberjackRootModule,
      providers: (options && [{ provide: LumberjackLogConfigToken, useValue: options }]) || [],
    };
  }

  constructor() {
    throw new Error('Do not import LumberjackModule directly. Use LumberjackModule.forRoot.');
  }
}
