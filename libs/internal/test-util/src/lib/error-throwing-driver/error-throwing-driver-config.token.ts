import { inject, InjectionToken } from '@angular/core';

import { LogDriverConfig, LogDriverConfigToken } from '@ngworker/lumberjack';

export const ErrorThrowingDriverConfigToken = new InjectionToken<LogDriverConfig>('Error-throwing driver config', {
  factory: () => inject(LogDriverConfigToken),
});
