import { inject, InjectionToken } from '@angular/core';

import { LogDriverConfig, logDriverConfigToken } from '@ngworker/lumberjack';

export const spyDriverConfigToken = new InjectionToken<LogDriverConfig>('__SPY_DRIVER_CONFIG__', {
  factory: () => inject(logDriverConfigToken),
});
