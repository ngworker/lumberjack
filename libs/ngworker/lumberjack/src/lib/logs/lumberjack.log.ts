import { LumberjackLogLevel } from './lumberjack-log-level';
import { Payload } from './payload';

/**
 * A Lumberjack log entry
 */
export interface LumberjackLog<TPayload extends Readonly<Payload> | void = void> {
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

  /**
   * Holds any payload info
   */
  readonly payload?: TPayload;
}
