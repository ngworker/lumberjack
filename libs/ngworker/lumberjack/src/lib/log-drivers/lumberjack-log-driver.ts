import { LumberjackLogDriverConfig } from '../configuration/lumberjack-log-driver.config';
import { LumberjackLog } from '../logs/lumberjack.log';

import { LumberjackLogDriverLog } from './lumberjack-log-driver-log';

// tslint:disable-next-line: no-any
export interface LumberjackLogDriver<F extends Record<string, any> | undefined = undefined> {
  readonly config: LumberjackLogDriverConfig;
  logCritical(driverLog: LumberjackLogDriverLog<F>): void;
  logDebug(driverLog: LumberjackLogDriverLog<F>): void;
  logError(driverLog: LumberjackLogDriverLog<F>): void;
  logInfo(driverLog: LumberjackLogDriverLog<F>): void;
  logTrace(driverLog: LumberjackLogDriverLog<F>): void;
  logWarning(driverLog: LumberjackLogDriverLog<F>): void;
}
