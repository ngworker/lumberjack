import { InjectionToken } from '@angular/core';

import { LumberjackLog } from '../lumberjack-log';
import { LumberjackLogConfigLevel, LumberjackLogLevel } from '../lumberjack-log-levels';

export const LumberjackLogConfigToken: InjectionToken<LumberjackLogConfig> = new InjectionToken(
  '__LUMBERJACK_LOG_CONFIG__'
);

export const LumberjackLogOptionsToken: InjectionToken<LumberjackLogOptions> = new InjectionToken(
  '__TEMP_LUMBERJACK_LOG_OPTIONS__'
);

export interface LumberjackLogConfig {
  format: (logEntry: LumberjackLog) => string;
  levels: LumberjackLogConfigLevel;
}

export type LumberjackLogOptions = Partial<LumberjackLogConfig>;

export const defaultProductionLevels: LumberjackLogConfigLevel = [
  LumberjackLogLevel.Critical,
  LumberjackLogLevel.Error,
  LumberjackLogLevel.Info,
  LumberjackLogLevel.Warning,
];

export const defaultDevelopmentLevels: LumberjackLogConfigLevel = [LumberjackLogLevel.Verbose];
