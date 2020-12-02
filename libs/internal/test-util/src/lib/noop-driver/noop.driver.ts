import { Inject, Injectable } from '@angular/core';

import { LumberjackLogDriver, LumberjackLogDriverConfig } from '@ngworker/lumberjack';

import { noopDriverConfigToken } from './noop-driver-config.token';

/**
 * No-op log driver.
 *
 * Every logging method is a no-op.
 */
@Injectable()
export class NoopDriver implements LumberjackLogDriver {
  constructor(@Inject(noopDriverConfigToken) public config: LumberjackLogDriverConfig) {}

  logCritical(logEntry: string): void {}

  logDebug(logEntry: string): void {}

  logError(logEntry: string): void {}

  logInfo(logEntry: string): void {}

  logTrace(logEntry: string): void {}

  logWarning(logEntry: string): void {}
}
