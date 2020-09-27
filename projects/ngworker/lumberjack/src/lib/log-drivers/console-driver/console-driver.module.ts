import { ModuleWithProviders, NgModule } from '@angular/core';

import { defaultLogDriverConfig, LogDriverConfig, LogDriverConfigToken } from '../../configs/log-driver.config';

import { ConsoleDriverRootModule } from './console-driver-root.module';

@NgModule()
export class ConsoleDriverModule {
  static forRoot(config: LogDriverConfig = defaultLogDriverConfig): ModuleWithProviders<ConsoleDriverRootModule> {
    return {
      ngModule: ConsoleDriverRootModule,
      providers: [{ provide: LogDriverConfigToken, useValue: config }],
    };
  }

  constructor() {
    throw new Error('Do not import ConsoleDriverModule directly. Use ConsoleDriverModule.forRoot.');
  }
}
