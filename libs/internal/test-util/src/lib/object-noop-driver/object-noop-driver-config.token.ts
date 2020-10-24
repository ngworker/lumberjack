import { inject, InjectionToken } from '@angular/core';

import { LogDriverConfig, LogDriverConfigToken } from '@ngworker/lumberjack';

export const ObjectNoopDriverConfigToken = new InjectionToken<LogDriverConfig>('Object No-op driver config', {
  factory: () => inject(LogDriverConfigToken),
});
