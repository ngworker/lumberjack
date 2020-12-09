import { LumberjackLevel } from './lumberjack-level';
import { LumberjackLogLevel } from './lumberjack-log-level';

/**
 * A Lumberjack log entry
 */
// tslint:disable-next-line: no-any
export interface LumberjackLog<TPayload extends Readonly<{ [key: string]: unknown }> | void = void> {
  /**
   * Context, for example domain, application, component, or service.
   */
  readonly context?: string;
  /**
   * Unix epoch ticks (milliseconds) timestamp when log entry was created.
   */
  readonly createdAt: number;
  /**
   * Level of severity.
   */
  readonly level: LumberjackLogLevel;
  /**
   * Log message, for example describing an event that happened.
   */
  readonly message: string;

  /**
   * Holds any payload info
   */
  readonly payload?: TPayload;
}
