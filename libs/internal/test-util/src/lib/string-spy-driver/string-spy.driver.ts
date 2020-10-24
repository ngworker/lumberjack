import { Inject, Injectable } from '@angular/core';

import { LogDriverConfig, StringLogDriver } from '@ngworker/lumberjack';

import { StringSpyDriverConfigToken } from './string-spy-driver-config.token';

/**
 * String Spy log driver.
 *
 * Every logging method is a spy.
 */
@Injectable()
export class StringSpyDriver implements StringLogDriver, jasmine.SpyObj<StringLogDriver> {
  constructor(@Inject(StringSpyDriverConfigToken) public config: LogDriverConfig) {}

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
