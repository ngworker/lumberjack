import { LogDriverConfig } from '../configuration/log-driver.config';

export interface LogDriver {
  readonly config: LogDriverConfig;
  logCritical(logEntry: string): void;
  logInfo(logEntry: string): void;
  logDebug(logEntry: string): void;
  logError(logEntry: string): void;
  logTrace(logEntry: string): void;
  logWarning(logEntry: string): void;
}
