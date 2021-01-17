import { LumberjackConfigLevels } from '../logs/lumberjack-config-levels';
import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';

import { LumberjackFormatFunction } from './lumberjack-format-function';

/**
 * The Lumberjack configuration is a set of settings used internally by various
 * Lumberjack services.
 */
export interface LumberjackConfig<TPayload extends LumberjackLogPayload | void = void> {
  /**
   * The Lumberjack format function used to generate the text representation of
   * a log.
   */
  readonly format: LumberjackFormatFunction<TPayload>;
  /**
   * The default log level filter.
   */
  readonly levels: LumberjackConfigLevels;
}
