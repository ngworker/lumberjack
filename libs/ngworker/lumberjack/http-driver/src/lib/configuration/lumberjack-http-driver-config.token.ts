import { InjectionToken } from '@angular/core';

import { LumberjackHttpDriverConfig } from './lumberjack-http-driver.config';

export const lumberjackHttpDriverConfigToken: InjectionToken<LumberjackHttpDriverConfig> = new InjectionToken(
  '__LUMBERJACK_HTTP_DRIVER_CONFIG__'
);
