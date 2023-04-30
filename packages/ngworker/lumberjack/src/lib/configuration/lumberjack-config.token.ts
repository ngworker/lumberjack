import { InjectionToken } from '@angular/core';
import { LumberjackConfig } from '@webworker/lumberjack';

/**
 * The Lumberjack configuration token is used internally by `LumberjackModule`
 * and various Lumberjack services.
 */
export const lumberjackConfigToken: InjectionToken<LumberjackConfig> = new InjectionToken('__LUMBERJACK_CONFIG__');
