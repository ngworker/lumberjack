import { inject, InjectionToken } from '@angular/core';

import { LogDriverConfig, LogDriverConfigToken } from '@ngworker/lumberjack';

export const ConsoleDriverConfigToken = new InjectionToken<LogDriverConfig>('Console driver config', {
  factory: () => inject(LogDriverConfigToken),
});
