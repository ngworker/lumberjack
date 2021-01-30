import { Inject, Injectable } from '@angular/core';

import { LumberjackLogDriver, LumberjackLogDriverConfig } from '@ngworker/lumberjack';

import { spyDriverConfigToken } from './spy-driver-config.token';

/**
 * Spy log driver.
 *
 * Every logging method is a spy.
 */
@Injectable()
export class SpyDriver implements LumberjackLogDriver, jest.Mocked<LumberjackLogDriver> {
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

export const createSpyObj = <T = unknown>(_baseName: string, methodNames?: string[]): jest.Mocked<T> => {
  const obj: any = {};
  if (methodNames) {
    for (let i = 0; i < methodNames.length; i++) {
      obj[methodNames[i]] = jest.fn();
    }

  }

  return obj;
};

export const createSpy = (_baseName?: string) => {
  return jest.fn();
};
