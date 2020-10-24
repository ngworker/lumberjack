import { ModuleWithProviders, NgModule } from '@angular/core';

import { LogDriverConfig } from '@ngworker/lumberjack';

import { ObjectNoopDriverConfigToken } from './object-noop-driver-config.token';
import { ObjectNoopDriverRootModule } from './object-noop-driver-root.module';

/**
 * Service module for `NoopDriver`.
 *
 * Use `NoopDriverModule.forRoot` to import.
 */
@NgModule()
export class ObjectNoopDriverModule {
  static forRoot(config?: LogDriverConfig): ModuleWithProviders<ObjectNoopDriverRootModule> {
    return {
      ngModule: ObjectNoopDriverRootModule,
      providers: (config && [{ provide: ObjectNoopDriverConfigToken, useValue: config }]) || [],
    };
  }

  constructor() {
    throw new Error('Do not import ObjectNoopDriverModule directly. Use ObjectNoopDriverModule.forRoot.');
  }
}
