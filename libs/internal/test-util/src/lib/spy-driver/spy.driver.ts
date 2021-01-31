/* tslint:disable */
import { Inject, Injectable } from '@angular/core';

import { LumberjackLogDriver, LumberjackLogDriverConfig, LumberjackLogPayload } from '@ngworker/lumberjack';

import { spyDriverConfigToken } from './spy-driver-config.token';

/**
 * Spy log driver.
 *
 * Every logging method is a spy.
 */
@Injectable()
export class SpyDriver<TPayload extends LumberjackLogPayload | void = void>
  implements LumberjackLogDriver<TPayload>, jest.Mocked<LumberjackLogDriver> {
  static driverIdentifier = 'SpyDriver';

  constructor(@Inject(spyDriverConfigToken) readonly config: LumberjackLogDriverConfig) {}

  logCritical = jest.fn();

  logDebug = jest.fn();

  logError = jest.fn();

  logInfo = jest.fn();

  logTrace = jest.fn();
  logWarning = jest.fn();

  /**
   * Reset tracking on spies.
   */
  reset(): void {
    this.logCritical.mockClear();
    this.logDebug.mockClear();
    this.logError.mockClear();
    this.logInfo.mockClear();
    this.logTrace.mockClear();
    this.logWarning.mockClear();
  }
}
