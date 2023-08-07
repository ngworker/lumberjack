import { InjectionToken } from '@angular/core';

import { LumberjackLogDriverConfig } from '@lumberjackjs/core';

export const objectDriverConfigToken = new InjectionToken<LumberjackLogDriverConfig>('__OBJECT_DRIVER_CONFIG__');
