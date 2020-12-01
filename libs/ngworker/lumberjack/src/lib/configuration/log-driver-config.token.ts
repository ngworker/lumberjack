import { InjectionToken } from '@angular/core';

import { LogDriverConfig } from './log-driver.config';

export const logDriverConfigToken: InjectionToken<LogDriverConfig> = new InjectionToken('__LOG_DRIVER_CONFIG__');
