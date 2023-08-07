/* eslint-disable @typescript-eslint/no-unused-vars */
// ⬆️ Maintain signature compatibility with LumberjackLogDriver
import {
  LumberjackLogDriver,
  LumberjackLogDriverConfig,
  LumberjackLogDriverLog,
  LumberjackLogPayload,
} from '@lumberjackjs/core';

import { NoopDriverConfig } from './noop-driver.config';

export type NoopDriver<TPayload extends LumberjackLogPayload | void = void> = LumberjackLogDriver<TPayload>;

export const noopDriverIdentifier = 'NoopDriver';

export function createNoopDriver<TPayload extends LumberjackLogPayload | void = void>(
  config: NoopDriverConfig
): NoopDriver<TPayload> {
  function logCritical(_driverLog: LumberjackLogDriverLog<TPayload>): void {
    // intentionally a no-op
  }

  function logDebug(_driverLog: LumberjackLogDriverLog<TPayload>): void {
    // intentionally a no-op
  }

  function logError(_driverLog: LumberjackLogDriverLog<TPayload>): void {
    // intentionally a no-op
  }

  function logInfo(_driverLog: LumberjackLogDriverLog<TPayload>): void {
    // intentionally a no-op
  }

  function logTrace(_driverLog: LumberjackLogDriverLog<TPayload>): void {
    // intentionally a no-op
  }

  function logWarning(_driverLog: LumberjackLogDriverLog<TPayload>): void {
    // intentionally a no-op
  }

  return {
    config: config as LumberjackLogDriverConfig,
    logCritical,
    logDebug,
    logError,
    logInfo,
    logTrace,
    logWarning,
  };
}
