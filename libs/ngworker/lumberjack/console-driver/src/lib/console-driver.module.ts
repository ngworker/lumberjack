import { ModuleWithProviders, NgModule } from '@angular/core';

import { LogDriverConfig } from '@ngworker/lumberjack';

import { ConsoleDriverConfigToken } from './console-driver-config.token';
import { ConsoleDriverRootModule } from './console-driver-root.module';

@NgModule()
export class ConsoleDriverModule {
  static forRoot(config?: LogDriverConfig): ModuleWithProviders<ConsoleDriverRootModule> {
    return {
      ngModule: ConsoleDriverRootModule,
      providers: (config && [{ provide: ConsoleDriverConfigToken, useValue: config }]) || [],
    };
  }

  constructor() {
    throw new Error('Do not import ConsoleDriverModule directly. Use ConsoleDriverModule.forRoot.');
  }
}
