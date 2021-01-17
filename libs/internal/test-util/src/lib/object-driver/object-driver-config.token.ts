import { inject, InjectionToken } from '@angular/core';

import { LumberjackLogDriverConfig, lumberjackLogDriverConfigToken } from '@ngworker/lumberjack';

import { ObjectDriver } from './object.driver';
export const objectDriverConfigToken = new InjectionToken<LumberjackLogDriverConfig>('__OBJECT_DRIVER_CONFIG__', {
  factory: () => ({ ...inject(lumberjackLogDriverConfigToken), identifier: ObjectDriver.driverIdentifier }),
});
