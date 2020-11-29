import { LumberjackLogLevel } from './lumberjack-log-level';

/**
 * A Lumberjack log entry
 */
export interface LumberjackLog {
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
   * Log messsage, for example describing an event that happened.
   */
  readonly message: string;
}
