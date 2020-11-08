import { InjectionToken } from '@angular/core';

import { LumberjackConsole } from './lumberjack-console';

export const LumberjackConsoleToken = new InjectionToken<LumberjackConsole>('Lumberjack Console', {
  factory: (): LumberjackConsole => console,
  providedIn: 'root',
});
