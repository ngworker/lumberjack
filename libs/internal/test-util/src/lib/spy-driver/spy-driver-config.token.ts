import { inject, InjectionToken } from '@angular/core';

import { LogDriverConfig, LogDriverConfigToken } from '@ngworker/lumberjack';

export const SpyDriverConfigToken = new InjectionToken<LogDriverConfig>('Spy driver config', {
  factory: () => inject(LogDriverConfigToken),
});
