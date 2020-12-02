import { LumberjackLogDriverConfig } from '../configuration/lumberjack-log-driver.config';

export interface LumberjackLogDriver {
  readonly config: LumberjackLogDriverConfig;
  logCritical(logEntry: string): void;
  logInfo(logEntry: string): void;
  logDebug(logEntry: string): void;
  logError(logEntry: string): void;
  logTrace(logEntry: string): void;
  logWarning(logEntry: string): void;
}
