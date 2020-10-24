import { Inject, Injectable } from '@angular/core';

import { LogDriverConfig, LumberjackLog, ObjectLogDriver } from '@ngworker/lumberjack';

import { ObjectNoopDriverConfigToken } from './object-noop-driver-config.token';

/**
 * No-op log driver.
 *
 * Every logging method is a no-op.
 */
@Injectable()
export class ObjectNoopDriver implements ObjectLogDriver {
  constructor(@Inject(ObjectNoopDriverConfigToken) public config: LogDriverConfig) {}
  logDebug(logEntry: LumberjackLog): void {}
  logError(logEntry: LumberjackLog): void {}
  logInfo(logEntry: LumberjackLog): void {}
  logWarning(logEntry: LumberjackLog): void {}
}
