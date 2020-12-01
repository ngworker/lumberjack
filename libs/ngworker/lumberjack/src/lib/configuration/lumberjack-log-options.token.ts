import { InjectionToken } from '@angular/core';

import { LumberjackLogOptions } from './lumberjack-log.options';

export const lumberjackLogOptionsToken: InjectionToken<LumberjackLogOptions> = new InjectionToken(
  '__TEMP_LUMBERJACK_LOG_OPTIONS__'
);
