import { inject, InjectionToken } from '@angular/core';

import { LogDriverConfig, LogDriverConfigToken } from '@ngworker/lumberjack';

export const StringSpyDriverConfigToken = new InjectionToken<LogDriverConfig>('String Spy driver config', {
  factory: () => inject(LogDriverConfigToken),
});
