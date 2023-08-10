import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';
import { LumberjackLog } from '../logs/lumberjack.log';

import { LumberjackDriver } from './lumberjack-driver';

/**
 * A driver error reported by Lumberjack.
 */
export interface LumberjackDriverError<TPayload extends LumberjackLogPayload | void = void> {
  /**
   * The text representation of the log passed to the driver at the time of
   * failure.
   */
  readonly formattedLog: string;
  /**
   * The error thrown by the driver at the time of failure.
   */
  readonly error: unknown;
  /**
   * The log passed to the driver at the time of failure.
   */
  readonly log: LumberjackLog<TPayload>;
  /**
   * The failing driver.
   */
  readonly driver: LumberjackDriver<TPayload>;
}
