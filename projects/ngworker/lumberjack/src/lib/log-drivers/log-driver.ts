import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { LogDriverConfig } from '../configs/log-driver.config';

export const LogDriverToken: InjectionToken<LogDriver> = new InjectionToken('__LUMBERJACK_LOG_DRIVER_TOKEN__');

export interface LogDriver {
  config: LogDriverConfig;
  logInfo(logEntry: string): void | Promise<void> | Observable<void>;
  logDebug(logEntry: string): void | Promise<void> | Observable<void>;
  logError(logEntry: string): void | Promise<void> | Observable<void>;
  logWarning(logEntry: string): void | Promise<void> | Observable<void>;
}
