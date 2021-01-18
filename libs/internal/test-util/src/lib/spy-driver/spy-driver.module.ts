import { ModuleWithProviders, NgModule } from '@angular/core';

import { spyDriverConfigToken } from './spy-driver-config.token';
import { SpyDriverRootModule } from './spy-driver-root.module';
import { SpyDriverConfig } from './spy-driver.config';

/**
 * Service module for `SpyDriver`.
 *
 * Use `SpyDriverModule.forRoot` to import.
 */
@NgModule()
export class SpyDriverModule {
  static forRoot(config?: SpyDriverConfig): ModuleWithProviders<SpyDriverRootModule> {
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
