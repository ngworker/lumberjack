import { ModuleWithProviders, NgModule } from '@angular/core';

import { LogDriverConfig } from '@ngworker/lumberjack';

import { SpyDriverConfigToken } from './spy-driver-config.token';
import { SpyDriverRootModule } from './spy-driver-root.module';

/**
 * Service module for `SpyDriver`.
 *
 * Use `SpyDriverModule.forRoot` to import.
 */
@NgModule()
export class SpyDriverModule {
  static forRoot(config?: LogDriverConfig): ModuleWithProviders<SpyDriverRootModule> {
    return {
      ngModule: SpyDriverRootModule,
      providers: (config && [{ provide: SpyDriverConfigToken, useValue: config }]) || [],
    };
  }

  constructor() {
    throw new Error('Do not import SpyDriverModule directly. Use SpyDriverModule.forRoot.');
  }
}
