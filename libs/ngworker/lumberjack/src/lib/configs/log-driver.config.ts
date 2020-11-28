import { LumberjackLevel, LumberjackLogEntryLevel } from '../logs/lumberjack-log-levels';

export interface LogDriverConfig {
  /**
   * List of levels to which the log-driver is allowed to log.
   *
   * If undefined or [LumberjackLogLevel.Verbose] all levels are allowed.
   *
   */
  readonly levels: ReadonlyArray<LumberjackLogEntryLevel> | [LumberjackLevel.Verbose];
}
