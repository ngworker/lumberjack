import { inject, InjectionToken } from '@angular/core';

import { LogDriverConfig, logDriverConfigToken } from '@ngworker/lumberjack';
export const noopDriverConfigToken = new InjectionToken<LogDriverConfig>('__NO-OP_DRIVER_CONFIG__', {
  factory: () => inject(logDriverConfigToken),
});
