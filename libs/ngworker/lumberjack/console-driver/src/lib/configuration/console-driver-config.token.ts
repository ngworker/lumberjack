import { inject, InjectionToken } from '@angular/core';

import { LogDriverConfig, logDriverConfigToken } from '@ngworker/lumberjack';

export const consoleDriverConfigToken = new InjectionToken<LogDriverConfig>('__CONSOLE_DRIVER_CONFIG__', {
  factory: () => inject(logDriverConfigToken),
});
