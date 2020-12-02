import { inject, InjectionToken } from '@angular/core';

import { LumberjackLogDriverConfig, lumberjackLogDriverConfigToken } from '@ngworker/lumberjack';

export const lumberjackConsoleDriverConfigToken = new InjectionToken<LumberjackLogDriverConfig>(
  '__LUMBERJACK_CONSOLE_DRIVER_CONFIG__',
  {
    factory: () => inject(lumberjackLogDriverConfigToken),
  }
);
