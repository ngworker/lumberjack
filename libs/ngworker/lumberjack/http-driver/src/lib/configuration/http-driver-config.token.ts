import { InjectionToken } from '@angular/core';

import { HttpDriverConfig } from './http-driver.config';

export const httpDriverConfigToken: InjectionToken<HttpDriverConfig> = new InjectionToken('__HTTP_DRIVER_CONFIG__');
