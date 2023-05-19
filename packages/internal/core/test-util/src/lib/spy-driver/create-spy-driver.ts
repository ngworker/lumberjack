import { LumberjackLogDriver, LumberjackLogDriverConfig, LumberjackLogPayload } from '@webworker/lumberjack';

import { SpyDriverConfig } from './spy-driver.config';

export const spyDriverIdentifier = 'SpyDriver';

export type SpyDriver<TPayload extends LumberjackLogPayload | void = void> = LumberjackLogDriver<TPayload> &
  jest.Mocked<LumberjackLogDriver<TPayload>> & { reset: () => void };

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
    config: config as LumberjackLogDriverConfig,
    logCritical,
    logDebug,
    logError,
    logInfo,
    logTrace,
    logWarning,
    reset,
  };
}
