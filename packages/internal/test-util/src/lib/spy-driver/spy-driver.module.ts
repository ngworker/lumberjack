import { ModuleWithProviders, NgModule } from '@angular/core';

import { lumberjackLogDriverConfigToken } from '@ngworker/lumberjack';
import { LumberjackLogDriverConfig } from '@webworker/lumberjack';

import { spyDriverConfigToken } from './spy-driver-config.token';
import { SpyDriverRootModule } from './spy-driver-root.module';
import { SpyDriverConfig } from './spy-driver.config';
import { spyDriverIdentifier } from './spy.driver-factory';

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
