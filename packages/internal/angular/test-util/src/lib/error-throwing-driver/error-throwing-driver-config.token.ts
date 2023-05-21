import { InjectionToken } from '@angular/core';

import { ErrorThrowingDriverConfig } from '@internal/core/test-util';

export const errorThrowingDriverConfigToken = new InjectionToken<ErrorThrowingDriverConfig>(
  '__ERROR_THROWING_DRIVER_CONFIG__'
);
