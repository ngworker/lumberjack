import { InjectionToken } from '@angular/core';

import { LumberjackDriverConfig } from '@lumberjackjs/core';

/**
 * The Lumberjack driver configuration token is used internally by
 * `LumberjackModule`, various internal Lumberjack services, and drivers.
 */
export const lumberjackDriverConfigToken: InjectionToken<LumberjackDriverConfig> = new InjectionToken(
  '__LUMBERJACK_LOG_DRIVER_CONFIG__'
);
