import { ModuleWithProviders, NgModule } from '@angular/core';

import { LumberjackOptions } from '@webworker/lumberjack';

import { LumberjackRootModule } from './lumberjack-root.module';
import { LumberjackOptions } from './lumberjack.options';
import { provideLumberjack } from './provide-lumberjack';

/**
 * The Lumberjack Angular module is used to register necessary Lumberjack
 * services and configure shared settings.
 *
 * NOTE! Do not import `LumberjackModule` directly. Use
 * `LumberjackModule.forRoot`.
 */
@NgModule()
export class LumberjackModule {
  /**
   * Register necessary Lumberjack services and configure shared settings.
   *
   * @param options Settings shared throughout Lumberjack services and log
   *   drivers.
   */
  static forRoot(options?: LumberjackOptions): ModuleWithProviders<LumberjackRootModule> {
    return {
      ngModule: LumberjackRootModule,
      providers: [provideLumberjack(options)],
    };
  }

  constructor() {
    throw new Error('Do not import LumberjackModule directly. Use LumberjackModule.forRoot.');
  }
}
