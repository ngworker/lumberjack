import { ModuleWithProviders, NgModule } from '@angular/core';
import { LumberjackLogDriverConfig, lumberjackLogDriverConfigToken } from '@ngworker/lumberjack';

import { objectDriverConfigToken } from './object-driver-config.token';
import { ObjectDriverRootModule } from './object-driver-root.module';
import { ObjectDriverConfig } from './object-driver.config';
import { ObjectDriver } from './object.driver';

/**
 * Service module for `ObjectDriver`.
 *
 * Use `ObjectDriverModule.forRoot` to import.
 */
@NgModule()
export class ObjectDriverModule {
  static forRoot(config: Partial<ObjectDriverConfig> = {}): ModuleWithProviders<ObjectDriverRootModule> {
    return {
      ngModule: ObjectDriverRootModule,
      providers: [
        {
          provide: objectDriverConfigToken,
          deps: [lumberjackLogDriverConfigToken],
          useFactory: (logDriverConfig: LumberjackLogDriverConfig) => ({
            ...logDriverConfig,
            ...config,
            identifier: ObjectDriver.driverIdentifier,
          }),
        },
      ],
    };
  }

  constructor() {
    throw new Error('Do not import ObjectDriverModule directly. Use ObjectDriverModule.forRoot.');
  }
}
