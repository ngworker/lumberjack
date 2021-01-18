import { ModuleWithProviders, NgModule } from '@angular/core';

import { LumberjackLogDriverConfig } from '@ngworker/lumberjack';

import { spyDriverConfigToken } from './spy-driver-config.token';
import { SpyDriverRootModule } from './spy-driver-root.module';

/**
 * Service module for `SpyDriver`.
 *
 * Use `SpyDriverModule.forRoot` to import.
 */
@NgModule()
export class SpyDriverModule {
  static forRoot(config?: LumberjackLogDriverConfig): ModuleWithProviders<SpyDriverRootModule> {
    return {
      ngModule: SpyDriverRootModule,
      providers: [
        {
          provide: spyDriverConfigToken,
          useValue: config || {},
        },
      ],
    };
  }

  constructor() {
    throw new Error('Do not import SpyDriverModule directly. Use SpyDriverModule.forRoot.');
  }
}
