import { InjectionToken } from '@angular/core';
import { LumberjackLogDriverConfig } from '@webworker/lumberjack';

export const lumberjackConsoleDriverConfigToken = new InjectionToken<LumberjackLogDriverConfig>(
  '__LUMBERJACK_CONSOLE_DRIVER_CONFIG__'
);
