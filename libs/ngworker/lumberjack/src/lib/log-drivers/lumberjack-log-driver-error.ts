import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';
import { LumberjackLog } from '../logs/lumberjack.log';

import { LumberjackLogDriver } from './lumberjack-log-driver';

/**
 * A log driver error reported by Lumberjack.
 */
export interface LumberjackLogDriverError<TPayload extends LumberjackLogPayload | void = void> {
/**
* The text representation of the log passed to the driver at the moment of failure. 
*/
  readonly formattedLog: string;
/**
* The error threw by the driver at the moment of failure.
*/
  readonly error: unknown;
/**
* The log passed to the driver at the moment of failure.
*/
  readonly log: LumberjackLog<TPayload>;
/**
* The failing driver.
*/
  readonly logDriver: LumberjackLogDriver<TPayload>;
}
