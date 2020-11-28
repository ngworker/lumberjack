import { InjectionToken } from '@angular/core';

import { LogDriver } from './log-driver';

export const logDriverToken: InjectionToken<LogDriver> = new InjectionToken('__LUMBERJACK_LOG_DRIVER_TOKEN__');
