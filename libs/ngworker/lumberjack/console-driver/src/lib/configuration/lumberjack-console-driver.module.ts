import { ModuleWithProviders, NgModule } from '@angular/core';

import { lumberjackConsoleDriverConfigToken } from './lumberjack-console-driver-config.token';
import { LumberjackConsoleDriverDefaultIdentifier } from './lumberjack-console-driver-default-identifier';
import { LumberjackConsoleDriverRootModule } from './lumberjack-console-driver-root.module';
import { LumberjackConsoleDriverConfig } from './lumberjack-console-driver.config';

@NgModule()
export class LumberjackConsoleDriverModule {
  static forRoot(config?: LumberjackConsoleDriverConfig): ModuleWithProviders<LumberjackConsoleDriverRootModule> {
    return {
      ngModule: LumberjackConsoleDriverRootModule,
      providers:
        (config && [
          {
            provide: lumberjackConsoleDriverConfigToken,
            useValue: { ...{ identifier: LumberjackConsoleDriverDefaultIdentifier }, ...config },
          },
        ]) ||
        [],
    };
  }

  constructor() {
    throw new Error('Do not import LumberjackConsoleDriverModule directly. Use LumberjackConsoleDriverModule.forRoot.');
  }
}
