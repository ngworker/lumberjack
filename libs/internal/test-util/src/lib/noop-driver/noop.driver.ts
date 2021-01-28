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

  logCritical({ formattedLog }: LumberjackLogDriverLog): void {
    // intentionally a no-op
  }

  logDebug({ formattedLog }: LumberjackLogDriverLog): void {
    // intentionally a no-op
  }

  logError({ formattedLog }: LumberjackLogDriverLog): void {
    // intentionally a no-op
  }

  logInfo({ formattedLog }: LumberjackLogDriverLog): void {
    // intentionally a no-op
  }

  logTrace({ formattedLog }: LumberjackLogDriverLog): void {
    // intentionally a no-op
  }

  logWarning({ formattedLog }: LumberjackLogDriverLog): void {
    // intentionally a no-op
  }
}
