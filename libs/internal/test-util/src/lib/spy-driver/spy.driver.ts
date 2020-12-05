import { Inject, Injectable } from '@angular/core';

import { LumberjackLogDriver, LumberjackLogDriverConfig } from '@ngworker/lumberjack';

import { spyDriverConfigToken } from './spy-driver-config.token';

/**
 * Spy log driver.
 *
 * Every logging method is a spy.
 */
@Injectable()
export class SpyDriver implements LumberjackLogDriver, jasmine.SpyObj<LumberjackLogDriver> {
  constructor(@Inject(spyDriverConfigToken) public config: LumberjackLogDriverConfig) {}

  logCritical = jasmine.createSpy('logCritical');

  logDebug = jasmine.createSpy('logDebug');

  logError = jasmine.createSpy('logError');

  logInfo = jasmine.createSpy('logInfo');

  logTrace = jasmine.createSpy('logTrace');

  logWarning = jasmine.createSpy('logWarning');

  /**
   * Reset tracking on spies.
   */
  reset(): void {
    this.logCritical.calls.reset();
    this.logDebug.calls.reset();
    this.logError.calls.reset();
    this.logInfo.calls.reset();
    this.logTrace.calls.reset();
    this.logWarning.calls.reset();
  }
}
