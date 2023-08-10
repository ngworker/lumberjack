import { LumberjackDriverConfig } from '../configuration/lumberjack-driver.config';
import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';

import { LumberjackDriverLog } from './lumberjack-driver.log';

/**
 * The interface implemented by drivers. Optionally supports a log payload.
 */
export interface LumberjackDriver<TPayload extends LumberjackLogPayload | void = void> {
  /**
   * Driver settings.
   */
  readonly config: LumberjackDriverConfig;
  /**
   * A critical log and its text representation is passed to this method.
   */
  logCritical(driverLog: LumberjackDriverLog<TPayload>): void;
  /**
   * A debug log and its text representation is passed to this method.
   */
  logDebug(driverLog: LumberjackDriverLog<TPayload>): void;
  /**
   * An error log and its text representation is passed to this method.
   */
  logError(driverLog: LumberjackDriverLog<TPayload>): void;
  /**
   * An info log and its text representation is passed to this method.
   */
  logInfo(driverLog: LumberjackDriverLog<TPayload>): void;
  /**
   * A trace log and its text representation is passed to this method.
   */
  logTrace(driverLog: LumberjackDriverLog<TPayload>): void;
  /**
   * A warning log and its text representation is passed to this method.
   */
  logWarning(driverLog: LumberjackDriverLog<TPayload>): void;
}
