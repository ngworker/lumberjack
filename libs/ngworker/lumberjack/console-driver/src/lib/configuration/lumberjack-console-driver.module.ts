import { ModuleWithProviders, NgModule } from '@angular/core';

import { lumberjackConsoleDriverConfigToken } from './lumberjack-console-driver-config.token';
import { LumberjackConsoleDriverRootModule } from './lumberjack-console-driver-root.module';
import { LumberjackConsoleDriverConfig } from './lumberjack-console-driver.config';

/**
 * The console driver Angular module is used to configure and register the
 * console driver.
 *
 * NOTE! Do not import `LumberjackConsoleDriverModule` directly. Use
 * `LumberjackConsoleDriverModule.forRoot`.
 */
@NgModule()
export class LumberjackConsoleDriverModule {
  /**
   * Configure and register the console driver.
   *
   * @param config Settings used by the console driver.
   */
  static forRoot(config?: LumberjackConsoleDriverConfig): ModuleWithProviders<LumberjackConsoleDriverRootModule> {
    return {
      ngModule: LumberjackConsoleDriverRootModule,
      providers: [
        {
          provide: lumberjackConsoleDriverConfigToken,
          useValue: config || {},
        },
      ],
    };
  }

  constructor() {
    throw new Error('LumberjackConsoleDriverModule must guard against being imported directly');
  }
}
