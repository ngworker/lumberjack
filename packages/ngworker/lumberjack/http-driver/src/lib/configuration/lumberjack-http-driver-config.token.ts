import { InjectionToken } from '@angular/core';

import { LumberjackHttpDriverInternalConfig } from './lumberjack-http-driver-internal.config';

export const lumberjackHttpDriverConfigToken: InjectionToken<LumberjackHttpDriverInternalConfig> = new InjectionToken(
  '__LUMBERJACK_HTTP_DRIVER_CONFIG__'
);
