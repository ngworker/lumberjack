import { InjectionToken } from '@angular/core';

import { LumberjackLogDriverConfig } from '@webworker/lumberjack';

export const spyDriverConfigToken = new InjectionToken<LumberjackLogDriverConfig>('__SPY_DRIVER_CONFIG__');
