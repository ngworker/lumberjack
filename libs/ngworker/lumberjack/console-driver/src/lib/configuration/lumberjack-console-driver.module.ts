import { ModuleWithProviders, NgModule } from '@angular/core';

import { LumberjackLogDriverConfig, lumberjackLogDriverConfigToken } from '@ngworker/lumberjack';

import { LumberjackConsoleDriver } from '../log-drivers/lumberjack-console.driver';

import { lumberjackConsoleDriverConfigToken } from './lumberjack-console-driver-config.token';
import { LumberjackConsoleDriverRootModule } from './lumberjack-console-driver-root.module';
import { LumberjackConsoleDriverConfig } from './lumberjack-console-driver.config';

export function consoleDriverConfigFactory(config: LumberjackLogDriverConfig): LumberjackConsoleDriverConfig {
  return { ...config, identifier: LumberjackConsoleDriver.driverIdentifier };
}

@NgModule()
export class LumberjackConsoleDriverModule {
  static forRoot(config?: LumberjackConsoleDriverConfig): ModuleWithProviders<LumberjackConsoleDriverRootModule> {
    return {
      ngModule: LumberjackConsoleDriverRootModule,
      providers: (config && [
        {
          provide: lumberjackConsoleDriverConfigToken,
          useValue: { ...{ identifier: LumberjackConsoleDriver.driverIdentifier }, ...config },
        },
      ]) || [
        {
          provide: lumberjackConsoleDriverConfigToken,
          useFactory: consoleDriverConfigFactory,
          deps: [lumberjackLogDriverConfigToken],
        },
      ],
    };
  }

  constructor() {
    throw new Error('Do not import LumberjackConsoleDriverModule directly. Use LumberjackConsoleDriverModule.forRoot.');
  }
}
