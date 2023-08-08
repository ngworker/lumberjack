import { InjectionToken } from '@angular/core';

import { LumberjackAngularHttpDriverInternalConfig } from './lumberjack-angular-http-driver-internal.config';

export const LumberjackAngularHttpDriverConfigToken: InjectionToken<LumberjackAngularHttpDriverInternalConfig> = new InjectionToken(
  '__LUMBERJACK_HTTP_DRIVER_CONFIG__'
);
