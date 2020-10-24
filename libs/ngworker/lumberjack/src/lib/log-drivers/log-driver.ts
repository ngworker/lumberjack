import { LogDriverConfig } from '../configs/log-driver.config';

export interface LogDriver<T> {
  config: LogDriverConfig;
  logInfo(logEntry: T): void;
  logDebug(logEntry: T): void;
  logError(logEntry: T): void;
  logWarning(logEntry: T): void;
}
