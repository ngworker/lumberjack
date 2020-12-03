import { InjectionToken } from '@angular/core';

import { LumberjackHttpDriverConfig } from './lumberjack-http-driver.config';

export const httpDriverConfigToken: InjectionToken<LumberjackHttpDriverConfig> = new InjectionToken(
  '__HTTP_DRIVER_CONFIG__'
);
