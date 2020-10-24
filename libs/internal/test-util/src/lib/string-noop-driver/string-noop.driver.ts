import { Inject, Injectable } from '@angular/core';

import { LogDriverConfig, StringLogDriver } from '@ngworker/lumberjack';

import { StringNoopDriverConfigToken } from './string-noop-driver-config.token';

/**
 * String No-op log driver.
 *
 * Every logging method is a no-op.
 */
@Injectable()
export class StringNoopDriver implements StringLogDriver {
  constructor(@Inject(StringNoopDriverConfigToken) public config: LogDriverConfig) {}
  logDebug(logEntry: string): void {}
  logError(logEntry: string): void {}
  logInfo(logEntry: string): void {}
  logWarning(logEntry: string): void {}
}
