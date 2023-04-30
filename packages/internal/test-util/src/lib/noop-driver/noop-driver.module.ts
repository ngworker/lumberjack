import { ModuleWithProviders, NgModule } from '@angular/core';
import { LumberjackLogDriverConfig } from '@webworkers/lumberjack';

import { lumberjackLogDriverConfigToken } from '@ngworker/lumberjack';

import { noopDriverConfigToken } from './noop-driver-config.token';
import { NoopDriverRootModule } from './noop-driver-root.module';
import { NoopDriverConfig } from './noop-driver.config';
import { NoopDriver } from './noop.driver';

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
          useFactory: (logDriverConfig: LumberjackLogDriverConfig): NoopDriverConfig => ({
            ...logDriverConfig,
            identifier: NoopDriver.driverIdentifier,
            ...config,
          }),
          deps: [lumberjackLogDriverConfigToken],
        },
      ],
      ngModule: NoopDriverRootModule,
    };
  }

  constructor() {
    throw new Error('Do not import NoopDriverModule directly. Use NoopDriverModule.forRoot.');
  }
}
