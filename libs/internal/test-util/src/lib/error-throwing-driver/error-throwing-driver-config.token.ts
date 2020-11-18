import { inject, InjectionToken } from '@angular/core';

import { LogDriverConfig, logDriverConfigToken } from '@ngworker/lumberjack';

export const errorThrowingDriverConfigToken = new InjectionToken<LogDriverConfig>('Error-throwing driver config', {
  factory: () => inject(logDriverConfigToken),
});
