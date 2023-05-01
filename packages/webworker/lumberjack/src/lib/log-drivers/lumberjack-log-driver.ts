import { LumberjackLogDriverConfig } from '../configuration/lumberjack-log-driver.config';
import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';

import { LumberjackLogDriverLog } from './lumberjack-log-driver.log';

/**
 * The interface implemented by log drivers. Optionally supports a log payload.
 */
export interface LumberjackLogDriver<TPayload extends LumberjackLogPayload | void = void> {
  /**
   * Log driver settings.
   */
  readonly config: LumberjackLogDriverConfig;
  /**
   * A critical log and its text representation is passed to this method.
   */
  logCritical(driverLog: LumberjackLogDriverLog<TPayload>): void;
  /**
   * A debug log and its text representation is passed to this method.
   */
  logDebug(driverLog: LumberjackLogDriverLog<TPayload>): void;
  /**
   * An error log and its text representation is passed to this method.
   */
  logError(driverLog: LumberjackLogDriverLog<TPayload>): void;
  /**
   * An info log and its text representation is passed to this method.
   */
  logInfo(driverLog: LumberjackLogDriverLog<TPayload>): void;
  /**
   * A trace log and its text representation is passed to this method.
   */
  logTrace(driverLog: LumberjackLogDriverLog<TPayload>): void;
  /**
   * A warning log and its text representation is passed to this method.
   */
  logWarning(driverLog: LumberjackLogDriverLog<TPayload>): void;
}
