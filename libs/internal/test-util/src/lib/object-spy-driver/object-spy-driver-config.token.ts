import { inject, InjectionToken } from '@angular/core';

import { LogDriverConfig, LogDriverConfigToken } from '@ngworker/lumberjack';

export const ObjectSpyDriverConfigToken = new InjectionToken<LogDriverConfig>('Object Spy driver config', {
  factory: () => inject(LogDriverConfigToken),
});
