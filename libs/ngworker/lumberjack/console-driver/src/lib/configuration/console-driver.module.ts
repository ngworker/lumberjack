import { ModuleWithProviders, NgModule } from '@angular/core';

import { LumberjackLogDriverConfig } from '@ngworker/lumberjack';

import { consoleDriverConfigToken } from './console-driver-config.token';
import { ConsoleDriverRootModule } from './console-driver-root.module';

@NgModule()
export class ConsoleDriverModule {
  static forRoot(config?: LumberjackLogDriverConfig): ModuleWithProviders<ConsoleDriverRootModule> {
    return {
      ngModule: ConsoleDriverRootModule,
      providers: (config && [{ provide: consoleDriverConfigToken, useValue: config }]) || [],
    };
  }

  constructor() {
    throw new Error('Do not import ConsoleDriverModule directly. Use ConsoleDriverModule.forRoot.');
  }
}
