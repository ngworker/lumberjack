import { InjectionToken } from '@angular/core';

import { LumberjackLogDriver } from '@lumberjackjs/core';

/**
 * A multi-provider token which log drivers use to register with Lumberjack.
 */
export const lumberjackLogDriverToken: InjectionToken<LumberjackLogDriver> = new InjectionToken(
  '__LUMBERJACK_LOG_DRIVER_TOKEN__'
);
