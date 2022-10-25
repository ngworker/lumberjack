import { InjectionToken } from '@angular/core';

import { LumberjackLogDriverConfig } from './lumberjack-log-driver.config';

/**
 * The Lumberjack log driver configuration token is used internally by
 * `LumberjackModule`, various internal Lumberjack services, and log drivers.
 */
export const lumberjackLogDriverConfigToken: InjectionToken<LumberjackLogDriverConfig> = new InjectionToken(
  '__LUMBERJACK_LOG_DRIVER_CONFIG__'
);
