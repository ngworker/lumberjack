import { InjectionToken } from '@angular/core';

import { LumberjackLog } from '../lumberjack-log';

export const LumberjackLogConfigToken: InjectionToken<LumberjackLogConfig> = new InjectionToken(
  '__LUMBERJACK_LOG_CONFIG__'
);

export interface LumberjackLogConfig {
  format(logEntry: LumberjackLog): string;
}
