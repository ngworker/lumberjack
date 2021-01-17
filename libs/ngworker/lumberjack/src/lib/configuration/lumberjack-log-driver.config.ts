import { LumberjackConfigLevels } from '../logs/lumberjack-config-levels';

/**
 * A Lumberjack log driver configuration is a set of settings for a Lumberjack
 * log driver.
 */
export interface LumberjackLogDriverConfig {
  /**
   * Used to filter logs passed to the log driver based on the log's log level.
   *
   * `[LumberjackLevel.Verbose]` indicates that all log levels are allowed.
   */
  readonly levels: LumberjackConfigLevels;
}
