import { ModuleWithProviders, NgModule } from '@angular/core';

import { LumberjackLogDriverConfig } from '@lumberjackjs/core';
import { lumberjackLogDriverConfigToken } from '@lumberjackjs/angular';
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
          useFactory: (logDriverConfig: LumberjackLogDriverConfig): NoopDriverConfig => ({
            ...logDriverConfig,
            identifier: noopDriverIdentifier,
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
