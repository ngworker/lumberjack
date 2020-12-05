import { ModuleWithProviders, NgModule } from '@angular/core';

import { LumberjackLogDriverConfig } from '@ngworker/lumberjack';

import { noopDriverConfigToken } from './noop-driver-config.token';
import { NoopDriverRootModule } from './noop-driver-root.module';

/**
 * Service module for `NoopDriver`.
 *
 * Use `NoopDriverModule.forRoot` to import.
 */
@NgModule()
export class NoopDriverModule {
  static forRoot(config?: LumberjackLogDriverConfig): ModuleWithProviders<NoopDriverRootModule> {
    return {
      ngModule: NoopDriverRootModule,
      providers: (config && [{ provide: noopDriverConfigToken, useValue: config }]) || [],
    };
  }

  constructor() {
    throw new Error('Do not import NoopDriverModule directly. Use NoopDriverModule.forRoot.');
  }
}
