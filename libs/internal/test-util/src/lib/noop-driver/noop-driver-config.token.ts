import { inject, InjectionToken } from '@angular/core';

import { LumberjackLogDriverConfig, lumberjackLogDriverConfigToken } from '@ngworker/lumberjack';

import { NoopDriver } from './noop.driver';

export const noopDriverConfigToken = new InjectionToken<LumberjackLogDriverConfig>('__NO-OP_DRIVER_CONFIG__', {
  factory: () => ({ ...inject(lumberjackLogDriverConfigToken), identifier: NoopDriver.name }),
});
