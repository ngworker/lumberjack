import { LumberjackLogDriver, LumberjackLogDriverLog } from '@webworker/lumberjack';

import { ErrorThrowingDriverConfig } from './error-throwing-driver.config';

export type ErrorThrowingDriver = ReturnType<typeof createErrorThrowingDriver>;

export const errorThrowingDriverIdentifier = 'ErrorThrowingDriver';

/**
 * Error-throwing log driver.
 *
 * Every logging method throws an error after the configured number of logs.
 */
export function createErrorThrowingDriver(config: ErrorThrowingDriverConfig): LumberjackLogDriver {
  let logCount = 0;

  function logCritical({ formattedLog }: LumberjackLogDriverLog): void {
    log(formattedLog);
  }

  function logDebug({ formattedLog }: LumberjackLogDriverLog): void {
    log(formattedLog);
  }

  function logError({ formattedLog }: LumberjackLogDriverLog): void {
    log(formattedLog);
  }

  function logInfo({ formattedLog }: LumberjackLogDriverLog): void {
    log(formattedLog);
  }

  function logTrace({ formattedLog }: LumberjackLogDriverLog): void {
    log(formattedLog);
  }

  function logWarning({ formattedLog }: LumberjackLogDriverLog): void {
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
