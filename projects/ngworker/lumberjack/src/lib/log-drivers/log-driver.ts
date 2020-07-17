import { InjectionToken } from '@angular/core';
import { LogDriverConfig } from '../configs/log-driver.config';

export const LogDriverToken: InjectionToken<LogDriver> = new InjectionToken('__LUMBERJACK_LOG_DRIVER_TOKEN__');

export interface LogDriver {
  config: LogDriverConfig;
  logInfo(logEntry: string): void;
  logDebug(logEntry: string): void;
  logError(logEntry: string): void;
  logWarning(logEntry: string): void;
}
