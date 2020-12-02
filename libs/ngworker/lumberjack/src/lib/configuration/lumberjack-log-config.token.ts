import { InjectionToken } from '@angular/core';

import { LumberjackConfig } from './lumberjack.config';

export const lumberjackLogConfigToken: InjectionToken<LumberjackConfig> = new InjectionToken(
  '__LUMBERJACK_LOG_CONFIG__'
);
