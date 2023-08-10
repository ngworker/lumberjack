import { LumberjackConfigLevels } from '../logs/lumberjack-config-levels';

/**
 * Settings for a driver.
 */
export interface LumberjackDriverConfig {
  /**
   * Used to filter logs passed to the driver based on the log's log level.
   *
   * `[LumberjackLevel.Verbose]` indicates that all log levels are allowed.
   */
  readonly levels: LumberjackConfigLevels;

  /**
   * Driver Identifier, necessary for driver filtering.
   */
  readonly identifier: string;
}
