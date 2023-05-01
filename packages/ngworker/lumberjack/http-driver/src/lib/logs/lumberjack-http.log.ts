import { LumberjackLog, LumberjackLogPayload } from '@webworker/lumberjack';

/**
 * The HTTP request sent to the configured log store.
 */
export interface LumberjackHttpLog<TPayload extends LumberjackLogPayload | void = void> {
  /**
   * The text representation of the log.
   */
  readonly formattedLog: string;
  /**
   * The log. Optionally supports a log payload.
   */
  readonly log: LumberjackLog<TPayload>;
  /**
   * The identifier of the application that emitted the log.
   *
   * This is used by the log store to organize logs.
   */
  readonly origin: string;
}
