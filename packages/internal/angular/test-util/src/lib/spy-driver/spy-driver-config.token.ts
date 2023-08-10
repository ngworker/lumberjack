import { InjectionToken } from '@angular/core';

import { LumberjackDriverConfig } from '@lumberjackjs/core';

export const spyDriverConfigToken = new InjectionToken<LumberjackDriverConfig>('__SPY_DRIVER_CONFIG__');
