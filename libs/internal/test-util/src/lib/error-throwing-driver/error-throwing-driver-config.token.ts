import { InjectionToken } from '@angular/core';

import { LumberjackLogDriverConfig } from '@ngworker/lumberjack';

export const errorThrowingDriverConfigToken = new InjectionToken<LumberjackLogDriverConfig>(
  '__ERROR_THROWING_DRIVER_CONFIG'
);

export interface ErrorThrowingDriverConfig extends LumberjackLogDriverConfig {
  /**
   * Number of logs that will success before throwing an error.
   */
  readonly logsBeforeThrowing: number;
}
