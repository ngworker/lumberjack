/* eslint-disable @typescript-eslint/no-unused-vars */
// ⬆️ Maintain signature compatibility with LumberjackDriver
import {
  LumberjackDriver,
  LumberjackDriverConfig,
  LumberjackDriverLog,
  LumberjackLogPayload,
} from '@lumberjackjs/core';

import { NoopDriverConfig } from './noop-driver.config';

export type NoopDriver<TPayload extends LumberjackLogPayload | void = void> = LumberjackDriver<TPayload>;

export const noopDriverIdentifier = 'NoopDriver';

export function createNoopDriver<TPayload extends LumberjackLogPayload | void = void>(
  config: NoopDriverConfig
): NoopDriver<TPayload> {
  function logCritical(_driverLog: LumberjackDriverLog<TPayload>): void {
    // intentionally a no-op
  }

  function logDebug(_driverLog: LumberjackDriverLog<TPayload>): void {
    // intentionally a no-op
  }

  function logError(_driverLog: LumberjackDriverLog<TPayload>): void {
    // intentionally a no-op
  }

  function logInfo(_driverLog: LumberjackDriverLog<TPayload>): void {
    // intentionally a no-op
  }

  function logTrace(_driverLog: LumberjackDriverLog<TPayload>): void {
    // intentionally a no-op
  }

  function logWarning(_driverLog: LumberjackDriverLog<TPayload>): void {
    // intentionally a no-op
  }

  return {
    config: config as LumberjackDriverConfig,
    logCritical,
    logDebug,
    logError,
    logInfo,
    logTrace,
    logWarning,
  };
}
