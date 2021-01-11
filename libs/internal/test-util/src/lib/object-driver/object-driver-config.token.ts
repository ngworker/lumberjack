import { inject, InjectionToken } from '@angular/core';

import { LumberjackLogDriverConfig, lumberjackLogDriverConfigToken } from '@ngworker/lumberjack';
export const objectDriverConfigToken = new InjectionToken<LumberjackLogDriverConfig>('__OBJECT_DRIVER_CONFIG__', {
  factory: () => inject(lumberjackLogDriverConfigToken),
});
