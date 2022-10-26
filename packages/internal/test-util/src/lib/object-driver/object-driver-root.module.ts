import { inject, InjectFlags, NgModule } from '@angular/core';

import {
  LumberjackLogDriverConfig,
  lumberjackLogDriverConfigToken,
  lumberjackLogDriverToken,
} from '@ngworker/lumberjack';

import { objectDriverConfigToken } from './object-driver-config.token';
import { ObjectDriverConfig } from './object-driver.config';
import { ObjectDriver } from './object.driver';
import { ObjectService } from './object.service';

export function objectDriverFactory(
  logDriverConfig: LumberjackLogDriverConfig,
  objectDriverConfig: ObjectDriverConfig,
  objectService: ObjectService
): ObjectDriver {
  const baseConfig = { ...logDriverConfig, identifier: ObjectDriver.driverIdentifier };
  const fullConfig = { ...baseConfig, ...objectDriverConfig };

  return new ObjectDriver(fullConfig, objectService);
}

@NgModule({
  providers: [
    {
      provide: lumberjackLogDriverToken,
      useFactory: objectDriverFactory,
      deps: [lumberjackLogDriverConfigToken, objectDriverConfigToken, ObjectService],
      multi: true,
    },
  ],
})
export class ObjectDriverRootModule {
  maybeNgModuleFromParentInjector = inject(ObjectDriverRootModule, InjectFlags.SkipSelf | InjectFlags.Optional);
  constructor() {
    if (this.maybeNgModuleFromParentInjector) {
      throw new Error(
        'ObjectDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
