import { LumberjackLogDriverConfig } from '../configuration/lumberjack-log-driver.config';
import { LumberjackLog } from '../logs/lumberjack.log';

import { LumberjackLogDriverLog } from './lumberjack-log-driver-log';

export interface LumberjackLogDriver<TPayload extends Readonly<{ [key: string]: unknown }> | void = void> {
  readonly config: LumberjackLogDriverConfig;
  logCritical(driverLog: LumberjackLogDriverLog<TPayload>): void;
  logDebug(driverLog: LumberjackLogDriverLog<TPayload>): void;
  logError(driverLog: LumberjackLogDriverLog<TPayload>): void;
  logInfo(driverLog: LumberjackLogDriverLog<TPayload>): void;
  logTrace(driverLog: LumberjackLogDriverLog<TPayload>): void;
  logWarning(driverLog: LumberjackLogDriverLog<TPayload>): void;
}
