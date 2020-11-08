import { InjectionToken } from '@angular/core';

import { LumberjackLogEntryLevel, LumberjackLogLevel } from '../lumberjack-log-levels';

export const LogDriverConfigToken: InjectionToken<LogDriverConfig> = new InjectionToken('__LOG_DRIVER_CONFIG__');

export interface LogDriverConfig {
  /**
   * List of levels to which the log-driver is allowed to log.
   *
   * If undefined or [LumberjackLogLevel.Verbose] all levels are allowed.
   *
   */
  readonly levels: ReadonlyArray<LumberjackLogEntryLevel> | [LumberjackLogLevel.Verbose];
}
