import { InjectionToken } from '@angular/core';

import { LumberjackLogDriverConfig } from './lumberjack-log-driver.config';

export const logDriverConfigToken: InjectionToken<LumberjackLogDriverConfig> = new InjectionToken(
  '__LOG_DRIVER_CONFIG__'
);
