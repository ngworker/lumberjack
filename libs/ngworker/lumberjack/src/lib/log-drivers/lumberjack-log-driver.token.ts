import { InjectionToken } from '@angular/core';

import { LumberjackLogDriver } from './lumberjack-log-driver';

export const lumberjackLogDriverToken: InjectionToken<LumberjackLogDriver> = new InjectionToken(
  '__LUMBERJACK_LOG_DRIVER_TOKEN__'
);
