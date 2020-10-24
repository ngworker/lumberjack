import { ModuleWithProviders, NgModule } from '@angular/core';

import { LogDriverConfig } from '@ngworker/lumberjack';

import { StringNoopDriverConfigToken } from './string-noop-driver-config.token';
import { StringNoopDriverRootModule } from './string-noop-driver-root.module';

/**
 * Service module for `NoopDriver`.
 *
 * Use `NoopDriverModule.forRoot` to import.
 */
@NgModule()
export class StringNoopDriverModule {
  static forRoot(config?: LogDriverConfig): ModuleWithProviders<StringNoopDriverRootModule> {
    return {
      ngModule: StringNoopDriverRootModule,
      providers: (config && [{ provide: StringNoopDriverConfigToken, useValue: config }]) || [],
    };
  }

  constructor() {
    throw new Error('Do not import StringNoopDriverModule directly. Use StringNoopDriverModule.forRoot.');
  }
}
