import { LumberjackLogDriverConfig } from '../configuration/lumberjack-log-driver.config';
import { Payload } from '../logs/payload';

import { LumberjackLogDriverLog } from './lumberjack-log-driver.log';

export interface LumberjackLogDriver<TPayload extends Readonly<Payload> | void = void> {
  readonly config: LumberjackLogDriverConfig;
  logCritical(driverLog: LumberjackLogDriverLog<TPayload>): void;
  logDebug(driverLog: LumberjackLogDriverLog<TPayload>): void;
  logError(driverLog: LumberjackLogDriverLog<TPayload>): void;
  logInfo(driverLog: LumberjackLogDriverLog<TPayload>): void;
  logTrace(driverLog: LumberjackLogDriverLog<TPayload>): void;
  logWarning(driverLog: LumberjackLogDriverLog<TPayload>): void;
}
