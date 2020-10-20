import { inject, InjectionToken } from '@angular/core';

import { LogDriverConfig, LogDriverConfigToken } from '@ngworker/lumberjack';

export const spyDriverConfigToken = new InjectionToken<LogDriverConfig>('Spy driver config', {
  factory: () => inject(LogDriverConfigToken),
});
