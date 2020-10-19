import { InjectionToken } from '@angular/core';

import { LumberjackLogLevel } from '../lumberjack-log-levels';

export const LogDriverConfigToken: InjectionToken<LogDriverConfig> = new InjectionToken('__LOG_DRIVER_CONFIG__');

export interface LogDriverConfig {
  /**
   * List of levels to which the log-driver is allowed to log.
   *
   * If undefined all levels are allowed.
   *
   */
  levels?: LumberjackLogLevel[];
}

export const defaultLogDriverConfig = {
  levels: undefined,
};
