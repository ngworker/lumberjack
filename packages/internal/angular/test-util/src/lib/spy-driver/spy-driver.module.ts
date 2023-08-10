import { ModuleWithProviders, NgModule } from '@angular/core';

import { lumberjackDriverConfigToken } from '@lumberjackjs/angular';
import { LumberjackDriverConfig } from '@lumberjackjs/core';
import { SpyDriverConfig, spyDriverIdentifier } from '@internal/core/test-util';

import { spyDriverConfigToken } from './spy-driver-config.token';
import { SpyDriverRootModule } from './spy-driver-root.module';

/**
 * Service module for `SpyDriver`.
 *
 * Use `SpyDriverModule.forRoot` to import.
 */
@NgModule()
export class SpyDriverModule {
  static forRoot(config: Partial<SpyDriverConfig> = {}): ModuleWithProviders<SpyDriverRootModule> {
    return {
      ngModule: SpyDriverRootModule,
      providers: [
        {
          provide: spyDriverConfigToken,
          useFactory: (driverConfig: LumberjackDriverConfig): SpyDriverConfig => ({
            ...driverConfig,
            identifier: spyDriverIdentifier,
            ...config,
          }),
          deps: [lumberjackDriverConfigToken],
        },
      ],
    };
  }

  constructor() {
    throw new Error('Do not import SpyDriverModule directly. Use SpyDriverModule.forRoot.');
  }
}
