import { LumberjackLogLevel } from './lumberjack-log-level';

/**
 * A Lumberjack log entry
 */
export interface LumberjackLog {
  /**
   * Scope, for example domain, application, component, or service.
   */
  readonly scope?: string;
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
}
