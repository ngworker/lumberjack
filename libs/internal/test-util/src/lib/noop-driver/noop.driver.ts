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

  logCritical(formattedLog: string): void {}

  logDebug(formattedLog: string): void {}

  logError(formattedLog: string): void {}

  logInfo(formattedLog: string): void {}

  logTrace(formattedLog: string): void {}

  logWarning(formattedLog: string): void {}
}
