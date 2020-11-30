import { InjectionToken } from '@angular/core';

import { LogDriverConfig } from '../configs/log-driver.config';

import { LumberjackLog } from './../lumberjack-log';

export const logDriverToken: InjectionToken<LogDriver> = new InjectionToken('__LUMBERJACK_LOG_DRIVER_TOKEN__');

export interface LogDriver<T extends LumberjackLog = LumberjackLog> {
  readonly config: LogDriverConfig;
  logCritical(formattedLog: string, log: T): void;
  logDebug(formattedLog: string, log: T): void;
  logError(formattedLog: string, log: T): void;
  logInfo(formattedLog: string, log: T): void;
  logTrace(formattedLog: string, log: T): void;
  logWarning(formattedLog: string, log: T): void;
}
