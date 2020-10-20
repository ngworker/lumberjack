import { Inject, Injectable } from '@angular/core';

import { LogDriver, LogDriverConfig, LogDriverConfigToken } from '@ngworker/lumberjack';

/**
 * No-op log driver.
 *
 * Every logging method is a no-op.
 */
@Injectable()
export class NoopDriver implements LogDriver {
  constructor(@Inject(LogDriverConfigToken) public config: LogDriverConfig) {}
  logDebug(logEntry: string): void {}
  logError(logEntry: string): void {}
  logInfo(logEntry: string): void {}
  logWarning(logEntry: string): void {}
}
