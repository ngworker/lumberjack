import { ModuleWithProviders, NgModule } from '@angular/core';

import { LogDriverConfig } from '@ngworker/lumberjack';

import { ObjectSpyDriverConfigToken } from './object-spy-driver-config.token';
import { ObjectSpyDriverRootModule } from './object-spy-driver-root.module';

/**
 * Service module for `ObjectSpyDriver`.
 *
 * Use `ObjectSpyDriverModule.forRoot` to import.
 */
@NgModule()
export class ObjectSpyDriverModule {
  static forRoot(config?: LogDriverConfig): ModuleWithProviders<ObjectSpyDriverRootModule> {
    return {
      ngModule: ObjectSpyDriverRootModule,
      providers: (config && [{ provide: ObjectSpyDriverConfigToken, useValue: config }]) || [],
    };
  }

  constructor() {
    throw new Error('Do not import ObjectSpyDriverModule directly. Use ObjectSpyDriverModule.forRoot.');
  }
}
