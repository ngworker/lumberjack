import { formatLogDriverError } from '../formatting/format-log-driver-error';
import { LumberjackLogDriver } from '../log-drivers/lumberjack-log-driver';
import { LumberjackLogDriverError } from '../log-drivers/lumberjack-log-driver-error';
import { LumberjackLevel } from '../logs/lumberjack-level';
import { LumberjackLogLevel } from '../logs/lumberjack-log-level';
import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';
import { LumberjackLog } from '../logs/lumberjack.log';

const noReportedLogDriverErrorIndex = -1;

interface LumberjackDependencies<TPayload extends LumberjackLogPayload | void> {
  drivers: LumberjackLogDriver<TPayload>[];
  logFormatter: (log: LumberjackLog<TPayload>) => { log: LumberjackLog<TPayload>; formattedLog: string };
  driverLogger: (
    driver: LumberjackLogDriver<TPayload>,
    logPackage: { log: LumberjackLog<TPayload>; formattedLog: string }
  ) => void;
  getUnixEpochTicks: () => number;
}

export function createLumberjack<TPayload extends LumberjackLogPayload | void = void>(
  deps: LumberjackDependencies<TPayload>
) {
  const log = (lumberjackLog: LumberjackLog<TPayload>) => {
    const { log, formattedLog } = deps.logFormatter(lumberjackLog);
    logWithErrorHandling(log, formattedLog, deps.drivers);
  };

  /**
   * Determine whether a log driver is configured to accept a log with the
   * specified log level.
   *
   * @param driver The configured log driver.
   * @param logLevel The log's log level.
   */
  function canDriveLog(driver: LumberjackLogDriver<TPayload>, logLevel: LumberjackLogLevel): boolean {
    const hasVerboseLogging = driver.config.levels.length === 1 && driver.config.levels[0] === LumberjackLevel.Verbose;
    const acceptsLogLevel = (driver.config.levels as LumberjackLogLevel[]).includes(logLevel);

    return hasVerboseLogging || acceptsLogLevel;
  }

  /**
   * Create a log based on the specified log driver error.
   *
   * @param driverError The reported log driver error.
   */
  function createDriverErrorLog(driverError: LumberjackLogDriverError<TPayload>): LumberjackLog<TPayload> {
    return {
      createdAt: deps.getUnixEpochTicks(),
      level: LumberjackLevel.Error,
      message: formatLogDriverError(driverError),
      scope: 'LumberjackLogDriverError',
    };
  }

  /**
   * If any stable log drivers are specified, the log driver errors will be
   * forward to them. Otherwise, they will be output to the browser console.
   *
   * @param stableDrivers The log drivers that haven't failed.
   * @param driverErrors The reported log driver errors.
   */
  function handleDriverErrors(
    stableDrivers: LumberjackLogDriver<TPayload>[],
    driverErrors: LumberjackLogDriverError<TPayload>[]
  ) {
    if (stableDrivers.length > 0) {
      logDriverErrorsToStableDrivers(driverErrors, stableDrivers);
    } else {
      outputUnhandledDriverErrors(driverErrors);
    }
  }

  /**
   * Pass the log to all the specified log drivers filtered by their log driver
   * configuration. If the driver throws an error while handling a log, an error
   * log with the caught error message will be created and passed to the stable
   * log drivers.
   *
   * @param log The log with an optional log payload.
   * @param formattedLog The text representation of the specified log.
   * @param drivers The log drivers.
   * @param driverErrors The reported log driver errors.
   * @param driverErrorIndex Index of the reported driver error to handle.
   */
  function logWithErrorHandling(
    log: LumberjackLog<TPayload>,
    formattedLog: string,
    drivers: LumberjackLogDriver<TPayload>[],
    driverErrors: LumberjackLogDriverError<TPayload>[] = [],
    driverErrorIndex = noReportedLogDriverErrorIndex
  ): void {
    const stableDrivers: LumberjackLogDriver<TPayload>[] = [];

    drivers
      .filter((driver) => canDriveLog(driver, log.level))
      .forEach((driver) => {
        try {
          deps.driverLogger.log(driver, { formattedLog, log });
          stableDrivers.push(driver);

          if (driverErrorIndex !== noReportedLogDriverErrorIndex) {
            removeHandledError(driverErrorIndex, driverErrors);
            driverErrorIndex = noReportedLogDriverErrorIndex;
          }
        } catch (error) {
          const caughtDriverError: LumberjackLogDriverError<TPayload> = { error, formattedLog, log, logDriver: driver };
          driverErrors = [...driverErrors, caughtDriverError];
        }
      });
    handleDriverErrors(stableDrivers, driverErrors);
  }

  /**
   * Pass the log driver errors to the specified stable log drivers.
   *
   * @param driverErrors The reported log driver errors.
   * @param stableDrivers The log drivers that haven't failed.
   */
  function logDriverErrorsToStableDrivers(
    driverErrors: LumberjackLogDriverError<TPayload>[],
    stableDrivers: LumberjackLogDriver<TPayload>[]
  ) {
    driverErrors.forEach((error, errorIndex) => {
      const driverErrorLog = createDriverErrorLog(error);

      logWithErrorHandling(driverErrorLog, driverErrorLog.message, stableDrivers, driverErrors, errorIndex);
    });
  }

  /**
   * Output the specified log driver error to the browser console.
   *
   * @param driverError The reported log driver error.
   */
  function outputDriverError(driverError: LumberjackLogDriverError<TPayload>): void {
    const errorMessage = formatLogDriverError(driverError);

    console.error(errorMessage);
  }

  /**
   * Output the unhandled log driver errors to the browser console.
   *
   * @param driverErrors The reported log driver errors.
   */
  function outputUnhandledDriverErrors(driverErrors: LumberjackLogDriverError<TPayload>[]) {
    driverErrors.forEach((error) => outputDriverError(error));
  }

  /**
   * Remove the log driver error with the specified index.
   *
   * @param driverErrorIndex The index of the log driver error to remove from
   *   the specified log driver errors.
   * @param driverErrors The reported log driver errors.
   */
  function removeHandledError(driverErrorIndex: number, driverErrors: LumberjackLogDriverError<TPayload>[]) {
    driverErrors.splice(driverErrorIndex, 1);
  }

  return {
    log,
  };
}
