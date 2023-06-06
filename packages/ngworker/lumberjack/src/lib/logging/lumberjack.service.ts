import { inject, Injectable } from '@angular/core';

import { formatLogDriverError } from '../formatting/format-log-driver-error';
import { LumberjackLogFormatter } from '../formatting/lumberjack-log-formatter.service';
import { LumberjackLogDriver } from '../log-drivers/lumberjack-log-driver';
import { LumberjackLogDriverError } from '../log-drivers/lumberjack-log-driver-error';
import { LumberjackLogDriverLogger } from '../log-drivers/lumberjack-log-driver-logger';
import { lumberjackLogDriverToken } from '../log-drivers/lumberjack-log-driver.token';
import { LumberjackLevel } from '../logs/lumberjack-level';
import { LumberjackLogLevel } from '../logs/lumberjack-log-level';
import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';
import { LumberjackLog } from '../logs/lumberjack.log';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

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
@Injectable()
export class LumberjackService<TPayload extends LumberjackLogPayload | void = void> {
  /**
   * The registered log drivers.
   */
  readonly #drivers = inject<LumberjackLogDriver<TPayload>[]>(lumberjackLogDriverToken, { optional: true }) ?? [];
  readonly #driverLogger = inject<LumberjackLogDriverLogger<TPayload>>(LumberjackLogDriverLogger);
  readonly #logFormatter = inject<LumberjackLogFormatter<TPayload>>(LumberjackLogFormatter);
  readonly #time = inject(LumberjackTimeService);

  constructor() {
    this.#drivers = Array.isArray(this.#drivers) ? this.#drivers : [this.#drivers];
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
    const { log, formattedLog } = this.#logFormatter.formatLog(lumberjackLog);

    this.#logWithErrorHandling(log, formattedLog, this.#drivers);
  }

  /**
   * Determine whether a log driver is configured to accept a log with the
   * specified log level.
   *
   * @param driver The configured log driver.
   * @param logLevel The log's log level.
   */
  #canDriveLog(driver: LumberjackLogDriver<TPayload>, logLevel: LumberjackLogLevel): boolean {
    const hasVerboseLogging = driver.config.levels.length === 1 && driver.config.levels[0] === LumberjackLevel.Verbose;
    const acceptsLogLevel = (driver.config.levels as LumberjackLogLevel[]).includes(logLevel);

    return hasVerboseLogging || acceptsLogLevel;
  }

  /**
   * Create a log based on the specified log driver error.
   *
   * @param driverError The reported log driver error.
   */
  #createDriverErrorLog(driverError: LumberjackLogDriverError<TPayload>): LumberjackLog<TPayload> {
    return {
      createdAt: this.#time.getUnixEpochTicks(),
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
  #handleDriverErrors(
    stableDrivers: LumberjackLogDriver<TPayload>[],
    driverErrors: LumberjackLogDriverError<TPayload>[]
  ) {
    if (stableDrivers.length > 0) {
      this.#logDriverErrorsToStableDrivers(driverErrors, stableDrivers);
    } else {
      this.#outputUnhandledDriverErrors(driverErrors);
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
  #logWithErrorHandling(
    log: LumberjackLog<TPayload>,
    formattedLog: string,
    drivers: LumberjackLogDriver<TPayload>[],
    driverErrors: LumberjackLogDriverError<TPayload>[] = [],
    driverErrorIndex = noReportedLogDriverErrorIndex
  ): void {
    const stableDrivers: LumberjackLogDriver<TPayload>[] = [];

    drivers
      .filter((driver) => this.#canDriveLog(driver, log.level))
      .forEach((driver) => {
        try {
          this.#driverLogger.log(driver, { formattedLog, log });
          stableDrivers.push(driver);

          if (driverErrorIndex !== noReportedLogDriverErrorIndex) {
            this.#removeHandledError(driverErrorIndex, driverErrors);
            driverErrorIndex = noReportedLogDriverErrorIndex;
          }
        } catch (error) {
          const caughtDriverError: LumberjackLogDriverError<TPayload> = { error, formattedLog, log, logDriver: driver };
          driverErrors = [...driverErrors, caughtDriverError];
        }
      });
    this.#handleDriverErrors(stableDrivers, driverErrors);
  }

  /**
   * Pass the log driver errors to the specified stable log drivers.
   *
   * @param driverErrors The reported log driver errors.
   * @param stableDrivers The log drivers that haven't failed.
   */
  #logDriverErrorsToStableDrivers(
    driverErrors: LumberjackLogDriverError<TPayload>[],
    stableDrivers: LumberjackLogDriver<TPayload>[]
  ) {
    driverErrors.forEach((error, errorIndex) => {
      const driverErrorLog = this.#createDriverErrorLog(error);

      this.#logWithErrorHandling(driverErrorLog, driverErrorLog.message, stableDrivers, driverErrors, errorIndex);
    });
  }

  /**
   * Output the specified log driver error to the browser console.
   *
   * @param driverError The reported log driver error.
   */
  #outputDriverError(driverError: LumberjackLogDriverError<TPayload>): void {
    const errorMessage = formatLogDriverError(driverError);

    console.error(errorMessage);
  }

  /**
   * Output the unhandled log driver errors to the browser console.
   *
   * @param driverErrors The reported log driver errors.
   */
  #outputUnhandledDriverErrors(driverErrors: LumberjackLogDriverError<TPayload>[]) {
    driverErrors.forEach((error) => this.#outputDriverError(error));
  }

  /**
   * Remove the log driver error with the specified index.
   *
   * @param driverErrorIndex The index of the log driver error to remove from
   *   the specified log driver errors.
   * @param driverErrors The reported log driver errors.
   */
  #removeHandledError(driverErrorIndex: number, driverErrors: LumberjackLogDriverError<TPayload>[]) {
    driverErrors.splice(driverErrorIndex, 1);
  }
}
