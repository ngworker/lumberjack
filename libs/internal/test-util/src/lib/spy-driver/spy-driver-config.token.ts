import { inject, InjectionToken } from '@angular/core';

import { LumberjackLogDriverConfig, lumberjackLogDriverConfigToken } from '@ngworker/lumberjack';

export const spyDriverConfigToken = new InjectionToken<LumberjackLogDriverConfig>('__SPY_DRIVER_CONFIG__', {
  factory: () => ({ ...inject(lumberjackLogDriverConfigToken), identifier: 'SpyDriver' }),
});
