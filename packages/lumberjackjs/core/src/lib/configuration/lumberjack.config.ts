import { LumberjackFormatFunction } from '../formatting/lumberjack-format-function';
import { LumberjackConfigLevels } from '../logs/lumberjack-config-levels';
import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';

/**
 * Settings used internally by various Lumberjack services.
 */
export interface LumberjackConfig<TPayload extends LumberjackLogPayload | void = void> {
  /**
   * The Lumberjack format function used to generate the text representation of
   * a log. If not provided, the default format function is used.
   */
  readonly format?: LumberjackFormatFunction<TPayload>;
  /**
   * The default log level filter.
   */
  readonly levels: LumberjackConfigLevels;
}
