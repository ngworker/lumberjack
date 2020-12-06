import { LumberjackLogDriverConfig } from '../configuration/lumberjack-log-driver.config';
import { LumberjackLog } from '../logs/lumberjack.log';

import { LumberjackLogDriverLog } from './lumberjack-log-driver-log';

export interface LumberjackLogDriver<TLog extends LumberjackLog = LumberjackLog> {
  readonly config: LumberjackLogDriverConfig;
  logCritical(driverLog: LumberjackLogDriverLog<TLog>): void;
  logDebug(driverLog: LumberjackLogDriverLog<TLog>): void;
  logError(driverLog: LumberjackLogDriverLog<TLog>): void;
  logInfo(driverLog: LumberjackLogDriverLog<TLog>): void;
  logTrace(driverLog: LumberjackLogDriverLog<TLog>): void;
  logWarning(driverLog: LumberjackLogDriverLog<TLog>): void;
}
