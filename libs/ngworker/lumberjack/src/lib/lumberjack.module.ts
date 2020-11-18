import { ModuleWithProviders, NgModule } from '@angular/core';

import { lumberjackLogOptionsToken } from './configs/lumberjack-log-options.token';
import { LumberjackLogOptions } from './configs/lumberjack-log.options';
import { LumberjackRootModule } from './lumberjack-root.module';

@NgModule()
export class LumberjackModule {
  static forRoot(options?: LumberjackLogOptions): ModuleWithProviders<LumberjackRootModule> {
    return {
      ngModule: LumberjackRootModule,
      providers: [{ provide: lumberjackLogOptionsToken, useValue: options }],
    };
  }

  constructor() {
    throw new Error('Do not import LumberjackModule directly. Use LumberjackModule.forRoot.');
  }
}
