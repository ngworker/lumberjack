import { inject, InjectionToken } from '@angular/core';

import { LumberjackLogDriverConfig, lumberjackLogDriverConfigToken } from '@ngworker/lumberjack';

import { LumberjackConsoleDriverDefaultIdentifier } from './lumberjack-console-driver-default-identifier';

export const lumberjackConsoleDriverConfigToken = new InjectionToken<LumberjackLogDriverConfig>(
  '__LUMBERJACK_CONSOLE_DRIVER_CONFIG__',
  {
    factory: () => ({
      ...inject(lumberjackLogDriverConfigToken),
      identifier: LumberjackConsoleDriverDefaultIdentifier,
    }),
  }
);
