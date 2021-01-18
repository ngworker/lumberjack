import { Inject, Injectable } from '@angular/core';

import { LumberjackLogDriver, LumberjackLogDriverConfig, LumberjackLogDriverLog } from '@ngworker/lumberjack';

import { noopDriverConfigToken } from './noop-driver-config.token';

/**
 * No-op log driver.
 *
 * Every logging method is a no-op.
 */
@Injectable()
export class NoopDriver implements LumberjackLogDriver {
  static driverIdentifier = 'NoopDriver';

  constructor(@Inject(noopDriverConfigToken) public config: LumberjackLogDriverConfig) {}

  logCritical({ formattedLog }: LumberjackLogDriverLog): void {}

  logDebug({ formattedLog }: LumberjackLogDriverLog): void {}

  logError({ formattedLog }: LumberjackLogDriverLog): void {}

  logInfo({ formattedLog }: LumberjackLogDriverLog): void {}

  logTrace({ formattedLog }: LumberjackLogDriverLog): void {}

  logWarning({ formattedLog }: LumberjackLogDriverLog): void {}
}
