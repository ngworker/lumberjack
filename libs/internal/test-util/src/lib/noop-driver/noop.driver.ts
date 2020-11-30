import { Inject, Injectable } from '@angular/core';

import { LogDriver, LogDriverConfig } from '@ngworker/lumberjack';

import { noopDriverConfigToken } from './noop-driver-config.token';

/**
 * No-op log driver.
 *
 * Every logging method is a no-op.
 */
@Injectable()
export class NoopDriver implements LogDriver {
  constructor(@Inject(noopDriverConfigToken) public config: LogDriverConfig) {}

  logCritical(formattedLog: string): void {}

  logDebug(formattedLog: string): void {}

  logError(formattedLog: string): void {}

  logInfo(formattedLog: string): void {}

  logTrace(formattedLog: string): void {}

  logWarning(formattedLog: string): void {}
}
