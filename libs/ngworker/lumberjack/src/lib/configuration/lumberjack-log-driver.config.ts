import { LumberjackConfigLevels } from '../logs/lumberjack-config-levels';

/**
 * A set of settings for a log driver.
 */
export interface LumberjackLogDriverConfig {
  /**
   * Used to filter logs passed to the log driver based on the log's log level.
   *
   * `[LumberjackLevel.Verbose]` indicates that all log levels are allowed.
   */
  readonly levels: LumberjackConfigLevels;
}
