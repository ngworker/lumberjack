import { InjectionToken } from '@angular/core';

import { LumberjackOptions } from './lumberjack.options';

export const lumberjackLogOptionsToken: InjectionToken<LumberjackOptions> = new InjectionToken(
  '__TEMP_LUMBERJACK_LOG_OPTIONS__'
);
