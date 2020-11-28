import { InjectionToken } from '@angular/core';

import { LogDriverConfig } from '../configs/log-driver.config';

export const logDriverToken: InjectionToken<LogDriver> = new InjectionToken('__LUMBERJACK_LOG_DRIVER_TOKEN__');

export interface LogDriver {
  readonly config: LogDriverConfig;
  logCritical(logEntry: string): void;
  logInfo(logEntry: string): void;
  logDebug(logEntry: string): void;
  logError(logEntry: string): void;
  logTrace(logEntry: string): void;
  logWarning(logEntry: string): void;
}
