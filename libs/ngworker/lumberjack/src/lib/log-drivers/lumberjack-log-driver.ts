import { LumberjackLogDriverConfig } from '../configuration/lumberjack-log-driver.config';
import { LumberjackLog } from '../logs/lumberjack.log';

import { LumberjackLogDriverLog } from './lumberjack-log-driver-log';

export interface LumberjackLogDriver<TLog extends LumberjackLog = LumberjackLog> {
  readonly config: LumberjackLogDriverConfig;
  logCritical(logEntry: LumberjackLogDriverLog<TLog>): void;
  logDebug(logEntry: LumberjackLogDriverLog<TLog>): void;
  logError(logEntry: LumberjackLogDriverLog<TLog>): void;
  logInfo(logEntry: LumberjackLogDriverLog<TLog>): void;
  logTrace(logEntry: LumberjackLogDriverLog<TLog>): void;
  logWarning(logEntry: LumberjackLogDriverLog<TLog>): void;
}
