import { InjectionToken } from '@angular/core';

import { LumberjackLogDriverConfig } from '@lumberjackjs/core';

export const noopDriverConfigToken = new InjectionToken<LumberjackLogDriverConfig>('__NO-OP_DRIVER_CONFIG__');
