import { InjectionToken } from '@angular/core';

import { LumberjackLogDriverConfig } from '@ngworker/lumberjack';

export const spyDriverConfigToken = new InjectionToken<LumberjackLogDriverConfig>('__SPY_DRIVER_CONFIG__');
