import { InjectionToken } from '@angular/core';

import { LogDriver } from './log-driver';

export const StringLogDriverToken: InjectionToken<StringLogDriver> = new InjectionToken(
  '__LUMBERJACK_STRING_LOG_DRIVER_TOKEN__'
);

export interface StringLogDriver extends LogDriver<string> {}
