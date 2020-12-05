import { InjectionToken } from '@angular/core';

import { LumberjackLogDriverConfig } from './lumberjack-log-driver.config';

export const lumberjackLogDriverConfigToken: InjectionToken<LumberjackLogDriverConfig> = new InjectionToken(
  '__LUMBERJACK_LOG_DRIVER_CONFIG__'
);
