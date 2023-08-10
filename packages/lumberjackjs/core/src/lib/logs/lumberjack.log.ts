import { LumberjackLogLevel } from './lumberjack-log-level';
import { LumberjackLogPayload } from './lumberjack-log-payload';

/**
 * A Lumberjack log. Optionally supports a payload.
 */
export interface LumberjackLog<TPayload extends LumberjackLogPayload | void = void> {
  /**
   * Unix epoch ticks in milliseconds representing when the log was created.
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
   * Optional payload with custom properties.
   *
   * NOTE! Make sure that these properties are supported by your drivers.
   */
  readonly payload?: TPayload;
  /**
   * Scope, for example domain, application, component, or service.
   */
  readonly scope?: string;
}
