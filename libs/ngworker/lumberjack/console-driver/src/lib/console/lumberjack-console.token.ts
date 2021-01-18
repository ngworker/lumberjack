import { InjectionToken } from '@angular/core';

import { LumberjackConsole } from './lumberjack-console';

/**
 * Wraps the browser console abstraction used by the console driver to make it
 * overridable in tests or add additional information to console logs.
 */
export const lumberjackConsoleToken = new InjectionToken<LumberjackConsole>('__LUMBERJACK_CONSOLE__', {
  factory: (): LumberjackConsole => console,
  providedIn: 'root',
});
