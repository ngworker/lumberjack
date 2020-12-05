import { ModuleWithProviders, NgModule } from '@angular/core';

import { LumberjackLogDriverConfig } from '@ngworker/lumberjack';

import { lumberjackConsoleDriverConfigToken } from './lumberjack-console-driver-config.token';
import { LumberjackConsoleDriverRootModule } from './lumberjack-console-driver-root.module';

@NgModule()
export class LumberjackConsoleDriverModule {
  static forRoot(config?: LumberjackLogDriverConfig): ModuleWithProviders<LumberjackConsoleDriverRootModule> {
    return {
      ngModule: LumberjackConsoleDriverRootModule,
      providers: (config && [{ provide: lumberjackConsoleDriverConfigToken, useValue: config }]) || [],
    };
  }

  constructor() {
    throw new Error('Do not import LumberjackConsoleDriverModule directly. Use LumberjackConsoleDriverModule.forRoot.');
  }
}
