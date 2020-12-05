import { InjectionToken } from '@angular/core';

import { LumberjackConfig } from './lumberjack.config';

export const lumberjackConfigToken: InjectionToken<LumberjackConfig> = new InjectionToken('__LUMBERJACK_CONFIG__');
