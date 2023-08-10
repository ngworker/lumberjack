import { InjectionToken } from '@angular/core';

import { LumberjackDriverConfig } from '@lumberjackjs/core';

export const noopDriverConfigToken = new InjectionToken<LumberjackDriverConfig>('__NO-OP_DRIVER_CONFIG__');
