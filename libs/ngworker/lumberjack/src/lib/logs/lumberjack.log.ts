import { LumberjackLogLevel } from './lumberjack-log-level';

/**
 * A Lumberjack log entry
 */
// tslint:disable-next-line: no-any
export interface LumberjackLog<F extends Record<string, any> = any> {
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
   * Holds any extra info
   */
  readonly extra?: F;
}
