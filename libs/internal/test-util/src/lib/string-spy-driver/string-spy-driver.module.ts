import { ModuleWithProviders, NgModule } from '@angular/core';

import { LogDriverConfig } from '@ngworker/lumberjack';

import { StringSpyDriverConfigToken } from './string-spy-driver-config.token';
import { StringSpyDriverRootModule } from './string-spy-driver-root.module';

/**
 * Service module for `StringSpyDriver`.
 *
 * Use `StringSpyDriverModule.forRoot` to import.
 */
@NgModule()
export class StringSpyDriverModule {
  static forRoot(config?: LogDriverConfig): ModuleWithProviders<StringSpyDriverRootModule> {
    return {
      ngModule: StringSpyDriverRootModule,
      providers: (config && [{ provide: StringSpyDriverConfigToken, useValue: config }]) || [],
    };
  }

  constructor() {
    throw new Error('Do not import StringSpyDriverModule directly. Use StringSpyDriverModule.forRoot.');
  }
}
