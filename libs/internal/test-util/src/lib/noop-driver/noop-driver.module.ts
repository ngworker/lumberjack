import { ModuleWithProviders, NgModule } from '@angular/core';

import { LogDriverConfig } from '@ngworker/lumberjack';

import { NoopDriverConfigToken } from './noop-driver-config.token';
import { NoopDriverRootModule } from './noop-driver-root.module';

/**
 * Service module for `NoopDriver`.
 *
 * Use `NoopDriverModule.forRoot` to import.
 */
@NgModule()
export class NoopDriverModule {
  static forRoot(config?: LogDriverConfig): ModuleWithProviders<NoopDriverRootModule> {
    return {
      ngModule: NoopDriverRootModule,
      providers: (config && [{ provide: NoopDriverConfigToken, useValue: config }]) || [],
    };
  }

  constructor() {
    throw new Error('Do not import NoopDriverModule directly. Use NoopDriverModule.forRoot.');
  }
}
