import { LumberjackDriver, LumberjackDriverLog } from '@lumberjackjs/core';

import { ErrorThrowingDriverConfig } from './error-throwing-driver.config';

export type ErrorThrowingDriver = LumberjackDriver;

export const errorThrowingDriverIdentifier = 'ErrorThrowingDriver';

/**
 * Error-throwing driver.
 *
 * Every logging method throws an error after the configured number of logs.
 */
export function createErrorThrowingDriver(config: ErrorThrowingDriverConfig): ErrorThrowingDriver {
  let logCount = 0;

  function logCritical({ formattedLog }: LumberjackDriverLog): void {
    log(formattedLog);
  }

  function logDebug({ formattedLog }: LumberjackDriverLog): void {
    log(formattedLog);
  }

  function logError({ formattedLog }: LumberjackDriverLog): void {
    log(formattedLog);
  }

  function logInfo({ formattedLog }: LumberjackDriverLog): void {
    log(formattedLog);
  }

  function logTrace({ formattedLog }: LumberjackDriverLog): void {
    log(formattedLog);
  }

  function logWarning({ formattedLog }: LumberjackDriverLog): void {
    log(formattedLog);
  }

  function log(formattedLog: string): void | never {
    if (logCount < config.logsBeforeThrowing) {
      logCount += 1;
    } else {
      throw new Error(`${config.identifier}: Failed to log "${formattedLog}"`);
    }
  }

  return {
    config,
    logCritical,
    logDebug,
    logError,
    logInfo,
    logTrace,
    logWarning,
  };
}
