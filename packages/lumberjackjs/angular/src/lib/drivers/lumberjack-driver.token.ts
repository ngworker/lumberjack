import { InjectionToken } from '@angular/core';

import { LumberjackDriver } from '@lumberjackjs/core';

/**
 * A multi-provider token which drivers use to register with Lumberjack.
 */
export const lumberjackDriverToken: InjectionToken<LumberjackDriver[]> = new InjectionToken(
  '__LUMBERJACK_LOG_DRIVER_TOKEN__'
);
