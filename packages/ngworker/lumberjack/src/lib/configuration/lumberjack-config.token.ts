import { InjectionToken } from '@angular/core';

import { LumberjackConfig } from './lumberjack.config';

/**
 * The Lumberjack configuration token is used internally by `provideLumberjack` function.
 * and various Lumberjack services.
 */
export const lumberjackConfigToken: InjectionToken<LumberjackConfig> = new InjectionToken('__LUMBERJACK_CONFIG__');
