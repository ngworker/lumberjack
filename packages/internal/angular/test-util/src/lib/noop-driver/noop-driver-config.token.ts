import { InjectionToken } from '@angular/core';

import { LumberjackLogDriverConfig } from '@webworker/lumberjack';

export const noopDriverConfigToken = new InjectionToken<LumberjackLogDriverConfig>('__NO-OP_DRIVER_CONFIG__');
