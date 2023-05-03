import { InjectionToken } from '@angular/core';

import { LumberjackLogDriverConfig } from '@webworker/lumberjack';

export const objectDriverConfigToken = new InjectionToken<LumberjackLogDriverConfig>('__OBJECT_DRIVER_CONFIG__');
