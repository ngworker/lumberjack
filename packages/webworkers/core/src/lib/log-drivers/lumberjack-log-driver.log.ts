import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';
import { LumberjackLog } from '../logs/lumberjack.log';

/**
 * The data structure passed to a log driver by Lumberjack. Optionally supports
 * a log payload.
 */
export interface LumberjackLogDriverLog<TPayload extends LumberjackLogPayload | void = void> {
  /**
   * The text representation of the log.
   */
  readonly formattedLog: string;
  /**
   * The log. Optionally supports a log payload.
   */
  readonly log: LumberjackLog<TPayload>;
}
