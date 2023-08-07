import { ModuleWithProviders, NgModule } from '@angular/core';

import { lumberjackLogDriverConfigToken } from '@lumberjackjs/angular';
import { LumberjackLogDriverConfig } from '@lumberjackjs/core';
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
          useFactory: (logDriverConfig: LumberjackLogDriverConfig): SpyDriverConfig => ({
            ...logDriverConfig,
            identifier: spyDriverIdentifier,
            ...config,
          }),
          deps: [lumberjackLogDriverConfigToken],
        },
      ],
    };
  }

  constructor() {
    throw new Error('Do not import SpyDriverModule directly. Use SpyDriverModule.forRoot.');
  }
}
