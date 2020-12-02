import { InjectionToken } from '@angular/core';

import { LumberjackOptions } from './lumberjack.options';

export const lumberjackOptionsToken: InjectionToken<LumberjackOptions> = new InjectionToken(
  '__TEMP_LUMBERJACK_LOG_OPTIONS__'
);
