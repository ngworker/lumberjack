import { LumberjackConfigLevels } from '../logs/lumberjack-config-levels';

/**
 * Settings for a log driver.
 */
export interface LumberjackLogDriverConfig {
  /**
   * Used to filter logs passed to the log driver based on the log's log level.
   *
   * `['verbose']` indicates that all log levels are allowed.
   */
  readonly levels: LumberjackConfigLevels;

  /**
   * Driver Identifier, necessary for driver filtering.
   */
  readonly identifier: string;
}
