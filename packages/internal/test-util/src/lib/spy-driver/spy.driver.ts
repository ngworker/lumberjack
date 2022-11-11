import { inject, Injectable } from '@angular/core';

import { LumberjackLogDriver, LumberjackLogPayload } from '@ngworker/lumberjack';

import { spyDriverConfigToken } from './spy-driver-config.token';

/**
 * Spy log driver.
 *
 * Every logging method is a spy.
 */
@Injectable()
export class SpyDriver<TPayload extends LumberjackLogPayload | void = void>
  implements LumberjackLogDriver<TPayload>, jest.Mocked<LumberjackLogDriver>
{
  static driverIdentifier = 'SpyDriver';

  readonly config = inject(spyDriverConfigToken);
  readonly logCritical = jest.fn();
  readonly logDebug = jest.fn();
  readonly logError = jest.fn();
  readonly logInfo = jest.fn();
  readonly logTrace = jest.fn();
  readonly logWarning = jest.fn();

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
