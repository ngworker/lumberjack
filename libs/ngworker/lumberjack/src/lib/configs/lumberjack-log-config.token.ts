import { InjectionToken } from '@angular/core';

import { LumberjackLogConfig } from './lumberjack-log.config';

export const lumberjackLogConfigToken: InjectionToken<LumberjackLogConfig> = new InjectionToken(
  '__LUMBERJACK_LOG_CONFIG__'
);
