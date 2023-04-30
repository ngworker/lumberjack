import { ModuleWithProviders, NgModule } from '@angular/core';
import { LumberjackLogDriverConfig } from '@webworkers/lumberjack';

import { LumberjackConsoleDriverRootModule } from './lumberjack-console-driver-root.module';
import { LumberjackConsoleDriverConfig } from './lumberjack-console-driver.config';
import { provideLumberjackConsoleDriver } from './provide-lumberjack-console-driver';

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
  static forRoot(
    config: Partial<LumberjackConsoleDriverConfig> = {}
  ): ModuleWithProviders<LumberjackConsoleDriverRootModule> {
    return {
      ngModule: LumberjackConsoleDriverRootModule,
      providers: [provideLumberjackConsoleDriver(config)],
    };
  }

  constructor() {
    throw new Error('Do not import LumberjackConsoleDriverModule directly. Use LumberjackConsoleDriverModule.forRoot.');
  }
}
