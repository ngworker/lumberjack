import { ModuleWithProviders, NgModule } from '@angular/core';

import { LumberjackLogOptions, LumberjackLogOptionsToken } from './configs/lumberjack-log.config';
import { LumberjackRootModule } from './lumberjack-root.module';

@NgModule()
export class LumberjackModule {
  static forRoot(options?: LumberjackLogOptions): ModuleWithProviders<LumberjackRootModule> {
    return {
      ngModule: LumberjackRootModule,
      providers: [{ provide: LumberjackLogOptionsToken, useValue: options }],
    };
  }

  constructor() {
    throw new Error('Do not import LumberjackModule directly. Use LumberjackModule.forRoot.');
  }
}
