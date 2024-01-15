import { Provider } from '@angular/core';

import {
  LumberjackLogDriverConfig,
  lumberjackLogDriverConfigToken,
  lumberjackLogDriverToken,
} from '@ngworker/lumberjack';

import { objectDriverConfigToken } from './object-driver-config.token';
import { ObjectDriverConfig } from './object-driver.config';
import { ObjectDriver } from './object.driver';

export function provideObjectDriver(config: Partial<ObjectDriverConfig> = {}): Provider[] {
  return [
    {
      provide: objectDriverConfigToken,
      deps: [lumberjackLogDriverConfigToken],
      useFactory: (logDriverConfig: LumberjackLogDriverConfig): ObjectDriverConfig => ({
        ...logDriverConfig,
        identifier: ObjectDriver.driverIdentifier,
        ...config,
      }),
    },
    {
      provide: lumberjackLogDriverToken,
      useClass: ObjectDriver,
      multi: true,
    },
  ];
}
