import { InjectionToken } from '@angular/core';

import { LumberjackOptions } from '@lumberjackjs/core';

export const lumberjackOptionsToken: InjectionToken<LumberjackOptions> = new InjectionToken(
  '__TEMP_LUMBERJACK_LOG_OPTIONS__'
);
