import { LumberjackConfig } from '../configuration/lumberjack.config';
import { createLumberjackLogFormatter } from '../formatting/create-lumberjack-log-formatter';
import { formatDriverError } from '../formatting/format-driver-error';
import { createLumberjackDriverLogger } from '../drivers/create-lumberjack-driver-logger';
import { LumberjackDriver } from '../drivers/lumberjack-driver';
import { LumberjackDriverError } from '../drivers/lumberjack-driver-error';
import { LumberjackLevel } from '../logs/lumberjack-level';
import { LumberjackLogLevel } from '../logs/lumberjack-log-level';
import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';
import { LumberjackLog } from '../logs/lumberjack.log';

import { Lumberjack } from './lumberjack';

const noReportedDriverErrorIndex = -1;

interface LumberjackDependencies<TPayload extends LumberjackLogPayload | void> {
  drivers: LumberjackDriver<TPayload>[];
  readonly config: LumberjackConfig<TPayload>;
  getUnixEpochTicks?: () => number;
}

/**
 * Create a Lumberjack orchestrator object.
 *
 * @example
 * const drivers = [new ConsoleDriver(), new HttpDriver()];
 * const logFormatter = createLumberjackLogFormatter(deps);
 *
 * const lumberjack = createLumberjack({ drivers, logFormatter });
 *
 * const log = {
 *   scope: 'Application',
 *   createdAt: getUnixEpochTicks(),
 *   level: 'ERROR',
 *   message: 'An unexpected error occurred',
 * };
 *
 * lumberjack.log(log);
 */
export function createLumberjack<TPayload extends LumberjackLogPayload | void = void>({
  drivers,
  config,
  getUnixEpochTicks = () => new Date().valueOf(),
}: LumberjackDependencies<TPayload>): Lumberjack<TPayload> {
  const driverLogger = createLumberjackDriverLogger<TPayload>();
  const formatLog = createLumberjackLogFormatter({ config, getUnixEpochTicks });
  const log = (lumberjackLog: LumberjackLog<TPayload>) => {
    const { log, formattedLog } = formatLog(lumberjackLog);
    logWithErrorHandling(log, formattedLog, drivers);
  };

  /**
   * Determine whether a driver is configured to accept a log with the
   * specified log level.
   *
   * @param driver The configured driver.
   * @param logLevel The log's log level.
   */
  function canDriveLog(driver: LumberjackDriver<TPayload>, logLevel: LumberjackLogLevel): boolean {
    const hasVerboseLogging = driver.config.levels.length === 1 && driver.config.levels[0] === LumberjackLevel.Verbose;
    const acceptsLogLevel = (driver.config.levels as LumberjackLogLevel[]).includes(logLevel);

    return hasVerboseLogging || acceptsLogLevel;
  }

  /**
   * Create a log based on the specified driver error.
   *
   * @param driverError The reported driver error.
   */
  function createDriverErrorLog(driverError: LumberjackDriverError<TPayload>): LumberjackLog<TPayload> {
    return {
      createdAt: getUnixEpochTicks(),
      level: LumberjackLevel.Error,
      message: formatDriverError(driverError),
      scope: 'LumberjackDriverError',
    };
  }

  /**
   * If any stable drivers are specified, the driver errors will be
   * forward to them. Otherwise, they will be output to the browser console.
   *
   * @param stableDrivers The drivers that haven't failed.
   * @param driverErrors The reported driver errors.
   */
  function handleDriverErrors(
    stableDrivers: LumberjackDriver<TPayload>[],
    driverErrors: LumberjackDriverError<TPayload>[]
  ) {
    if (stableDrivers.length > 0) {
      driverErrorsToStableDrivers(driverErrors, stableDrivers);
    } else {
      outputUnhandledDriverErrors(driverErrors);
    }
  }

  /**
   * Pass the log to all the specified drivers filtered by their driver
   * configuration. If the driver throws an error while handling a log, an error
   * log with the caught error message will be created and passed to the stable
   * drivers.
   *
   * @param log The log with an optional log payload.
   * @param formattedLog The text representation of the specified log.
   * @param drivers The drivers.
   * @param driverErrors The reported driver errors.
   * @param driverErrorIndex Index of the reported driver error to handle.
   */
  function logWithErrorHandling(
    log: LumberjackLog<TPayload>,
    formattedLog: string,
    drivers: LumberjackDriver<TPayload>[],
    driverErrors: LumberjackDriverError<TPayload>[] = [],
    driverErrorIndex = noReportedDriverErrorIndex
  ): void {
    const stableDrivers: LumberjackDriver<TPayload>[] = [];

    drivers
      .filter((driver) => canDriveLog(driver, log.level))
      .forEach((driver) => {
        try {
          driverLogger.log(driver, { formattedLog, log });
          stableDrivers.push(driver);

          if (driverErrorIndex !== noReportedDriverErrorIndex) {
            removeHandledError(driverErrorIndex, driverErrors);
            driverErrorIndex = noReportedDriverErrorIndex;
          }
        } catch (error) {
          const caughtDriverError: LumberjackDriverError<TPayload> = { error, formattedLog, log, driver: driver };
          driverErrors = [...driverErrors, caughtDriverError];
        }
      });
    handleDriverErrors(stableDrivers, driverErrors);
  }

  /**
   * Pass the driver errors to the specified stable drivers.
   *
   * @param driverErrors The reported driver errors.
   * @param stableDrivers The drivers that haven't failed.
   */
  function driverErrorsToStableDrivers(
    driverErrors: LumberjackDriverError<TPayload>[],
    stableDrivers: LumberjackDriver<TPayload>[]
  ) {
    driverErrors.forEach((error, errorIndex) => {
      const driverErrorLog = createDriverErrorLog(error);

      logWithErrorHandling(driverErrorLog, driverErrorLog.message, stableDrivers, driverErrors, errorIndex);
    });
  }

  /**
   * Output the specified driver error to the browser console.
   *
   * @param driverError The reported driver error.
   */
  function outputDriverError(driverError: LumberjackDriverError<TPayload>): void {
    const errorMessage = formatDriverError(driverError);

    console.error(errorMessage);
  }

  /**
   * Output the unhandled driver errors to the browser console.
   *
   * @param driverErrors The reported driver errors.
   */
  function outputUnhandledDriverErrors(driverErrors: LumberjackDriverError<TPayload>[]) {
    driverErrors.forEach((error) => outputDriverError(error));
  }

  /**
   * Remove the driver error with the specified index.
   *
   * @param driverErrorIndex The index of the driver error to remove from
   *   the specified driver errors.
   * @param driverErrors The reported driver errors.
   */
  function removeHandledError(driverErrorIndex: number, driverErrors: LumberjackDriverError<TPayload>[]) {
    driverErrors.splice(driverErrorIndex, 1);
  }

  return {
    log,
  };
}
