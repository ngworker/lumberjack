import { ModuleWithProviders, NgModule } from '@angular/core';

import { lumberjackOptionsToken } from './lumberjack-options.token';
import { LumberjackRootModule } from './lumberjack-root.module';
import { LumberjackOptions } from './lumberjack.options';

/**
 * The Lumberjack Angular module is used to register required necessary
 * Lumberjack services and configure shared settings.
 *
 * NOTE! Do not import `LumberjackModule` directly. Use
 * `LumberjackModule.forRoot`.
 */
@NgModule()
export class LumberjackModule {
  static forRoot(options?: LumberjackOptions): ModuleWithProviders<LumberjackRootModule> {
    return {
      ngModule: LumberjackRootModule,
      providers: [{ provide: lumberjackOptionsToken, useValue: options }],
    };
  }

  constructor() {
    throw new Error('Do not import LumberjackModule directly. Use LumberjackModule.forRoot.');
  }
}
