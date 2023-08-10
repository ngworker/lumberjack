import { ModuleWithProviders, NgModule } from '@angular/core';

import { LumberjackDriverConfig } from '@lumberjackjs/core';
import { lumberjackDriverConfigToken } from '@lumberjackjs/angular';
import { NoopDriverConfig, noopDriverIdentifier } from '@internal/core/test-util';

import { noopDriverConfigToken } from './noop-driver-config.token';
import { NoopDriverRootModule } from './noop-driver-root.module';

/**
 * Service module for `NoopDriver`.
 *
 * Use `NoopDriverModule.forRoot` to import.
 */
@NgModule()
export class NoopDriverModule {
  static forRoot(config: Partial<NoopDriverConfig> = {}): ModuleWithProviders<NoopDriverRootModule> {
    return {
      providers: [
        {
          provide: noopDriverConfigToken,
          useFactory: (driverConfig: LumberjackDriverConfig): NoopDriverConfig => ({
            ...driverConfig,
            identifier: noopDriverIdentifier,
            ...config,
          }),
          deps: [lumberjackDriverConfigToken],
        },
      ],
      ngModule: NoopDriverRootModule,
    };
  }

  constructor() {
    throw new Error('Do not import NoopDriverModule directly. Use NoopDriverModule.forRoot.');
  }
}
