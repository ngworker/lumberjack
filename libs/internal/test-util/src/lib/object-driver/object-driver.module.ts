import { ModuleWithProviders, NgModule } from '@angular/core';

import { LumberjackLogDriverConfig } from '@ngworker/lumberjack';

import { objectDriverConfigToken } from './object-driver-config.token';
import { ObjectDriverRootModule } from './object-driver-root.module';

/**
 * Service module for `ObjectDriver`.
 *
 * Use `ObjectDriverModule.forRoot` to import.
 */
@NgModule()
export class ObjectDriverModule {
  static forRoot(config?: LumberjackLogDriverConfig): ModuleWithProviders<ObjectDriverRootModule> {
    return {
      ngModule: ObjectDriverRootModule,
      providers: (config && [{ provide: objectDriverConfigToken, useValue: config }]) || [],
    };
  }

  constructor() {
    throw new Error('Do not import ObjectDriverModule directly. Use ObjectDriverModule.forRoot.');
  }
}
