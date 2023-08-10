import { LumberjackDriverConfig, LumberjackLogPayload } from '@lumberjackjs/core';

import { SpyDriverConfig } from './spy-driver.config';
import { SpyDriver } from './spy.driver';

export const spyDriverIdentifier = 'SpyDriver';

export function createSpyDriver<TPayload extends LumberjackLogPayload | void = void>(
  config: SpyDriverConfig
): SpyDriver<TPayload> {
  const logCritical = jest.fn();
  const logDebug = jest.fn();
  const logError = jest.fn();
  const logInfo = jest.fn();
  const logTrace = jest.fn();
  const logWarning = jest.fn();

  function reset(): void {
    logCritical.mockClear();
    logDebug.mockClear();
    logError.mockClear();
    logInfo.mockClear();
    logTrace.mockClear();
    logWarning.mockClear();
  }

  return {
    config: config as LumberjackDriverConfig,
    logCritical,
    logDebug,
    logError,
    logInfo,
    logTrace,
    logWarning,
    reset,
  };
}
