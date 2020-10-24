import { inject, InjectionToken } from '@angular/core';

import { LogDriverConfig, LogDriverConfigToken } from '@ngworker/lumberjack';

export const StringNoopDriverConfigToken = new InjectionToken<LogDriverConfig>('String No-op driver config', {
  factory: () => inject(LogDriverConfigToken),
});
