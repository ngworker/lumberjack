import { InjectionToken } from '@angular/core';

import { LogDriverConfig } from '../configs/log-driver.config';
import { LumberjackLog } from '../lumberjack-log';

import { LumberjackLogDriverLog } from './lumberjack-log-driver-log';

export const logDriverToken: InjectionToken<LogDriver> = new InjectionToken('__LUMBERJACK_LOG_DRIVER_TOKEN__');

export interface LogDriver<T extends LumberjackLog = LumberjackLog> {
  readonly config: LogDriverConfig;
  logCritical(logEntry: LumberjackLogDriverLog<T>): void;
  logDebug(logEntry: LumberjackLogDriverLog<T>): void;
  logError(logEntry: LumberjackLogDriverLog<T>): void;
  logInfo(logEntry: LumberjackLogDriverLog<T>): void;
  logTrace(logEntry: LumberjackLogDriverLog<T>): void;
  logWarning(logEntry: LumberjackLogDriverLog<T>): void;
}
