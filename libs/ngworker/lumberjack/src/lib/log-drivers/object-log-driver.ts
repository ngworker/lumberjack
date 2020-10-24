import { InjectionToken } from '@angular/core';

import { LumberjackLog } from '../lumberjack-log';

import { LogDriver } from './log-driver';

export const ObjectLogDriverToken: InjectionToken<ObjectLogDriver> = new InjectionToken(
  '__LUMBERJACK_OBJECT_LOG_DRIVER_TOKEN__'
);

export interface ObjectLogDriver extends LogDriver<LumberjackLog> {}
