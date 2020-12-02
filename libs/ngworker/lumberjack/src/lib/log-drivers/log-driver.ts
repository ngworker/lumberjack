import { InjectionToken } from '@angular/core';

import { LogDriverConfig } from '../configs/log-driver.config';
import { LumberjackLog } from '../lumberjack-log';

import { LumberjackLogDriverLog } from './lumberjack-log-driver-log';

export const logDriverToken: InjectionToken<LogDriver> = new InjectionToken('__LUMBERJACK_LOG_DRIVER_TOKEN__');

export interface LogDriver<TLog extends LumberjackLog = LumberjackLog> {
  readonly config: LogDriverConfig;
  logCritical(logEntry: LumberjackLogDriverLog<TLog>): void;
  logDebug(logEntry: LumberjackLogDriverLog<TLog>): void;
  logError(logEntry: LumberjackLogDriverLog<TLog>): void;
  logInfo(logEntry: LumberjackLogDriverLog<TLog>): void;
  logTrace(logEntry: LumberjackLogDriverLog<TLog>): void;
  logWarning(logEntry: LumberjackLogDriverLog<TLog>): void;
}
