import { InjectionToken } from '@angular/core';

import { LumberjackLogDriverConfig } from '@ngworker/lumberjack';

export const objectDriverConfigToken = new InjectionToken<LumberjackLogDriverConfig>('__OBJECT_DRIVER_CONFIG__');
