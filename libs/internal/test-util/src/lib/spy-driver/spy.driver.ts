import { Inject, Injectable } from '@angular/core';

import { LogDriver, LogDriverConfig } from '@ngworker/lumberjack';

import { SpyDriverConfigToken } from './spy-driver-config.token';

/**
 * Spy log driver.
 *
 * Every logging method is a spy.
 */
@Injectable()
export class SpyDriver implements LogDriver, jasmine.SpyObj<LogDriver> {
  constructor(@Inject(SpyDriverConfigToken) public config: LogDriverConfig) {}

  logDebug = jasmine.createSpy('logDebug');

  logError = jasmine.createSpy('logError');

  logInfo = jasmine.createSpy('logInfo');

  logWarning = jasmine.createSpy('logWarning');

  /**
   * Reset tracking on spies.
   */
  reset(): void {
    this.logDebug.calls.reset();
    this.logError.calls.reset();
    this.logInfo.calls.reset();
    this.logWarning.calls.reset();
  }
}
