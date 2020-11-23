import { inject, InjectionToken } from '@angular/core';

import { LogDriverConfig } from '@ngworker/lumberjack';

export const errorThrowingDriverConfigToken = new InjectionToken<LogDriverConfig>('__ERROR_THROWING_DRIVER_CONFIG');

export interface ErrorThrowingDriverConfig extends LogDriverConfig {
  /**
   * Number of logs that will success before throwing an error.
   */
  logsBeforeThrowing: number;
}
