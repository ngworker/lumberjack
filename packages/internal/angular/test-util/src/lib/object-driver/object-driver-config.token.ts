import { InjectionToken } from '@angular/core';

import { LumberjackDriverConfig } from '@lumberjackjs/core';

export const objectDriverConfigToken = new InjectionToken<LumberjackDriverConfig>('__OBJECT_DRIVER_CONFIG__');
