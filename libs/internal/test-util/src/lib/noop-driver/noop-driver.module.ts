import { ModuleWithProviders, NgModule } from '@angular/core';

import { noopDriverConfigToken } from './noop-driver-config.token';
import { NoopDriverRootModule } from './noop-driver-root.module';
import { NoopDriverConfig } from './noop-driver.config';

/**
 * Service module for `NoopDriver`.
 *
 * Use `NoopDriverModule.forRoot` to import.
 */
@NgModule()
export class NoopDriverModule {
  static forRoot(config?: NoopDriverConfig): ModuleWithProviders<NoopDriverRootModule> {
    return {
      ngModule: NoopDriverRootModule,
      providers: [
        {
          provide: noopDriverConfigToken,
          useValue: config || {},
        },
      ],
    };
  }

  constructor() {
    throw new Error('Do not import NoopDriverModule directly. Use NoopDriverModule.forRoot.');
  }
}
