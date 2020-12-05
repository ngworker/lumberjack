import { InjectionToken } from '@angular/core';

import { LumberjackConsole } from './lumberjack-console';

export const lumberjackConsoleToken = new InjectionToken<LumberjackConsole>('__LUMBERJACK_CONSOLE__', {
  factory: (): LumberjackConsole => console,
  providedIn: 'root',
});
