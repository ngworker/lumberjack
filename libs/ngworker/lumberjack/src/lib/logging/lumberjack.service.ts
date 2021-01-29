import { Inject, Injectable, Optional } from '@angular/core';

import { LumberjackRootModule } from '../configuration/lumberjack-root.module';
import { formatLogDriverError } from '../formatting/format-log-driver-error';
import { formatUnsupportedLogLevelError } from '../formatting/format-unsupported-log-level-error';
import { LumberjackLogFormatter } from '../formatting/lumberjack-log-formatter.service';
import { LumberjackLogDriver } from '../log-drivers/lumberjack-log-driver';
import { LumberjackLogDriverError } from '../log-drivers/lumberjack-log-driver-error';
import { LumberjackLogDriverLog } from '../log-drivers/lumberjack-log-driver.log';
import { lumberjackLogDriverToken } from '../log-drivers/lumberjack-log-driver.token';
import { LumberjackLevel } from '../logs/lumberjack-level';
import { LumberjackLogLevel } from '../logs/lumberjack-log-level';
import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';
import { LumberjackLog } from '../logs/lumberjack.log';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

type LogLevelToLoggerTransform<TPayload extends LumberjackLogPayload | void = void> = {
  [level in LumberjackLogLevel]?: (
    driver: LumberjackLogDriver<TPayload>,
    driverLog: LumberjackLogDriverLog<TPayload>
  ) => void;
};

const noReportedLogDriverErrorIndex = -1;

/**
 * Service with programmatic API to pass logs to Lumberjack. Optionally
 * supports a log payload.
 *
 * Lumberjack passes the logs to the registered log drivers based on their
 * configurations.
 *
 * NOTE! Consider extending the `LumberjackLogger` or `ScopedLumberjackLogger`
 * base classes to set up predefined loggers unless you need a programmatic
 * API.
 */
@Injectable({ providedIn: LumberjackRootModule })
export class LumberjackService<TPayload extends LumberjackLogPayload | void = void> {
  /**
   * The registered log drivers.
   */
  private readonly drivers: LumberjackLogDriver<TPayload>[];
  private readonly loggerMap: LogLevelToLoggerTransform<TPayload> = {
    [LumberjackLevel.Critical]: (driver, driverLog) => driver.logCritical(driverLog),
    [LumberjackLevel.Debug]: (driver, driverLog) => driver.logDebug(driverLog),
    [LumberjackLevel.Error]: (driver, driverLog) => driver.logError(driverLog),
    [LumberjackLevel.Info]: (driver, driverLog) => driver.logInfo(driverLog),
    [LumberjackLevel.Trace]: (driver, driverLog) => driver.logTrace(driverLog),
    [LumberjackLevel.Warning]: (driver, driverLog) => driver.logWarning(driverLog),
  };

  constructor(
    @Optional() @Inject(lumberjackLogDriverToken) drivers: LumberjackLogDriver<TPayload>[],
    private readonly logFormatter: LumberjackLogFormatter<TPayload>,
    private readonly time: LumberjackTimeService
  ) {
    drivers = drivers || [];
    this.drivers = Array.isArray(drivers) ? drivers : [drivers];
  }

  /**
   * Pass a log to Lumberjack which will be forwarded to the registered log
   * drivers based on their configurations.
   *
   * NOTE! It's recommended to use `LumberjackLogBuilder` to create the log.
   *
   * @param lumberjackLog The Lumberjack log. Optionally supports a log payload.
   */
  log(lumberjackLog: LumberjackLog<TPayload>): void {
    const { log, formattedLog } = this.logFormatter.formatLog(lumberjackLog);

    this.logWithErrorHandling(log, formattedLog, this.drivers);
  }

  /**
   * Determine whether a log driver is configured to accept a log with the
   * specified log level.
   *
   * @param driver The configured log driver.
   * @param logLevel The log's log level.
   */
  private canDriveLog(driver: LumberjackLogDriver<TPayload>, logLevel: LumberjackLogLevel): boolean {
    const hasVerboseLogging = driver.config.levels.length === 1 && driver.config.levels[0] === LumberjackLevel.Verbose;
    const acceptsLogLevel = (driver.config.levels as LumberjackLogLevel[]).includes(logLevel);

    return hasVerboseLogging || acceptsLogLevel;
  }

  /**
   * Create a log based on the specified log driver error.
   *
   * @param driverError The reported log driver error.
   */
  private createDriverErrorLog(driverError: LumberjackLogDriverError<TPayload>): LumberjackLog<TPayload> {
    return {
      createdAt: this.time.getUnixEpochTicks(),
      level: LumberjackLevel.Error,
      message: formatLogDriverError(driverError),
      scope: 'LumberjackLogDriverError',
    };
  }

  /**
   * Create a log about an unsupported log level.
   *
   * @param level The unknown log level.
   */
  private createUnsupportedLogLevelErrorLog(
    log: LumberjackLog<TPayload>,
    formattedLog: string
  ): LumberjackLog<TPayload> {
    return {
      createdAt: this.time.getUnixEpochTicks(),
      level: LumberjackLevel.Error,
      message: formatUnsupportedLogLevelError(log, formattedLog),
      scope: 'LumberjackUnsupportedLogLevelError',
    };
  }

  /**
   * Pass the driver log to the method of the specified log driver which
   * corresponds to the log's log level.
   *
   * @param driver The log driver.
   * @param driverLog The log driver log.
   */
  private driveLog(driver: LumberjackLogDriver<TPayload>, driverLog: LumberjackLogDriverLog<TPayload>): void {
    const logger = this.loggerMap[driverLog.log.level];

    if (logger) {
      logger(driver, driverLog);
    } else {
      const unsupportedLogLevel = this.createUnsupportedLogLevelErrorLog(driverLog.log, driverLog.formattedLog);

      this.log(unsupportedLogLevel);
    }
  }

  /**
   * If any stable log drivers are specified, the log driver errors will be
   * forward to them. Otherwise, they will be output to the browser console.
   *
   * @param stableDrivers The log drivers that haven't failed.
   * @param driverErrors The reported log driver errors.
   */
  private handleDriverErrors(
    stableDrivers: LumberjackLogDriver<TPayload>[],
    driverErrors: LumberjackLogDriverError<TPayload>[]
  ) {
    if (stableDrivers.length > 0) {
      this.logDriverErrorsToStableDrivers(driverErrors, stableDrivers);
    } else {
      this.outputUnhandledDriverErrors(driverErrors);
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
  private logWithErrorHandling(
    log: LumberjackLog<TPayload>,
    formattedLog: string,
    drivers: LumberjackLogDriver<TPayload>[],
    driverErrors: LumberjackLogDriverError<TPayload>[] = [],
    driverErrorIndex = noReportedLogDriverErrorIndex
  ): void {
    const stableDrivers: LumberjackLogDriver<TPayload>[] = [];

    drivers
      .filter((driver) => this.canDriveLog(driver, log.level))
      .forEach((driver) => {
        try {
          this.driveLog(driver, { formattedLog, log });
          stableDrivers.push(driver);

          if (driverErrorIndex !== noReportedLogDriverErrorIndex) {
            this.removeHandledError(driverErrorIndex, driverErrors);
            driverErrorIndex = noReportedLogDriverErrorIndex;
          }
        } catch (error) {
          const caughtDriverError: LumberjackLogDriverError<TPayload> = { error, formattedLog, log, logDriver: driver };
          driverErrors = [...driverErrors, caughtDriverError];
        }
      });
    this.handleDriverErrors(stableDrivers, driverErrors);
  }

  /**
   * Pass the log driver errors to the specified stable log drivers.
   *
   * @param driverErrors The reported log driver errors.
   * @param stableDrivers The log drivers that haven't failed.
   */
  private logDriverErrorsToStableDrivers(
    driverErrors: LumberjackLogDriverError<TPayload>[],
    stableDrivers: LumberjackLogDriver<TPayload>[]
  ) {
    driverErrors.forEach((error, errorIndex) => {
      const driverErrorLog = this.createDriverErrorLog(error);

      this.logWithErrorHandling(driverErrorLog, driverErrorLog.message, stableDrivers, driverErrors, errorIndex);
    });
  }

  /**
   * Output the specified log driver error to the browser console.
   *
   * @param driverError The reported log driver error.
   */
  private outputDriverError(driverError: LumberjackLogDriverError<TPayload>): void {
    const errorMessage = formatLogDriverError(driverError);

    console.error(errorMessage);
  }

  /**
   * Output the unhandled log driver errors to the browser console.
   *
   * @param driverErrors The reported log driver errors.
   */
  private outputUnhandledDriverErrors(driverErrors: ReadonlyArray<LumberjackLogDriverError<TPayload>>) {
    driverErrors.forEach((error) => this.outputDriverError(error));
  }

  /**
   * Remove the log driver error with the specified index.
   *
   * @param driverErrorIndex The index of the log driver error to remove from
   *   the specified log driver errors.
   * @param driverErrors The reported log driver errors.
   */
  private removeHandledError(driverErrorIndex: number, driverErrors: LumberjackLogDriverError<TPayload>[]) {
    driverErrors.splice(driverErrorIndex, 1);
  }
}
