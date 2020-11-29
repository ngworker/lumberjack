import { LumberjackConfigLevels } from '../logs/lumberjack-log-levels';

export interface LogDriverConfig {
  /**
   * List of levels to which the log-driver is allowed to log.
   *
   * If undefined or [LumberjackLevel.Verbose], all levels are allowed.
   *
   */
  readonly levels: LumberjackConfigLevels;
}
