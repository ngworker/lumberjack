import {
  LumberjackLogDriver,
  LumberjackLogDriverConfig,
  LumberjackLogDriverLog,
  LumberjackLogPayload,
} from '@webworker/lumberjack';

export const driverIdentifier = 'LumberjackConsoleDriver';

export function createLumberjackConsoleDriver<TPayload extends LumberjackLogPayload | void = void>(
  config: LumberjackLogDriverConfig
): LumberjackLogDriver<TPayload> {
  /**
   * Output console error.
   *
   * @param param0 The log and its text representation.
   */
  function logCritical({ formattedLog, log: { payload } }: LumberjackLogDriverLog<TPayload>): void {
    console.error(formattedLog, payload);
  }

  /**
   * Output console debug message.
   *
   * @param param0 The log and its text representation.
   */
  function logDebug({ formattedLog, log: { payload } }: LumberjackLogDriverLog<TPayload>): void {
    console.debug(formattedLog, payload);
  }

  /**
   * Output console error.
   *
   * @param param0 The log and its text representation.
   */
  function logError({ formattedLog, log: { payload } }: LumberjackLogDriverLog<TPayload>): void {
    console.error(formattedLog, payload);
  }

  /**
   * Output console info.
   *
   * @param param0 The log and its text representation.
   */
  function logInfo({ formattedLog, log: { payload } }: LumberjackLogDriverLog<TPayload>): void {
    console.info(formattedLog, payload);
  }

  /**
   * Output console trace.
   *
   * @param param0 The log and its text representation.
   */
  function logTrace({ formattedLog, log: { payload } }: LumberjackLogDriverLog<TPayload>): void {
    console.trace(formattedLog, payload);
  }

  /**
   * Output console warning.
   *
   * @param param0 The log and its text representation.
   */
  function logWarning({ formattedLog, log: { payload } }: LumberjackLogDriverLog<TPayload>): void {
    console.warn(formattedLog, payload);
  }

  return {
    config,
    logCritical,
    logDebug,
    logError,
    logTrace,
    logInfo,
    logWarning,
  };
}
