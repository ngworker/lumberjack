import { ModuleWithProviders, NgModule } from '@angular/core';

import { objectDriverConfigToken } from './object-driver-config.token';
import { ObjectDriverRootModule } from './object-driver-root.module';
import { ObjectDriverConfig } from './object-driver.config';

/**
 * Service module for `ObjectDriver`.
 *
 * Use `ObjectDriverModule.forRoot` to import.
 */
@NgModule()
export class ObjectDriverModule {
  static forRoot(config?: ObjectDriverConfig): ModuleWithProviders<ObjectDriverRootModule> {
    return {
      ngModule: ObjectDriverRootModule,
      providers: [
        {
          provide: objectDriverConfigToken,
          useValue: config || {},
        },
      ],
    };
  }

  constructor() {
    throw new Error('Do not import ObjectDriverModule directly. Use ObjectDriverModule.forRoot.');
  }
}
