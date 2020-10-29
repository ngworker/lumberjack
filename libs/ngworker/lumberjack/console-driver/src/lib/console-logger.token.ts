import { InjectionToken } from '@angular/core';

import { ConsoleLogger } from './console-logger';

export const ConsoleLoggerToken = new InjectionToken<ConsoleLogger>('Console logger', {
  factory: (): ConsoleLogger => console,
  providedIn: 'root',
});
