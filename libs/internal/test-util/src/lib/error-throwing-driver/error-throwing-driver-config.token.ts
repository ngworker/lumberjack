import { InjectionToken } from '@angular/core';

import { ErrorThrowingDriverConfig } from './error-throwing-driver.config';

export const errorThrowingDriverConfigToken = new InjectionToken<ErrorThrowingDriverConfig>(
  '__ERROR_THROWING_DRIVER_CONFIG__'
);
