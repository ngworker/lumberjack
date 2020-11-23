import { Inject, Injectable, Optional, Type } from '@angular/core';

import { FormatFunction } from './configs/format-function';
import { lumberjackLogConfigToken } from './configs/lumberjack-log-config.token';
import { LumberjackLogConfig } from './configs/lumberjack-log.config';
import { LogDriver, logDriverToken } from './log-drivers';
import { LumberjackLog } from './lumberjack-log';
import { LumberjackLogEntryLevel, LumberjackLogLevel } from './lumberjack-log-levels';
import { LumberjackRootModule } from './lumberjack-root.module';
import { LumberjackTimeService } from './time/lumberjack-time.service';

interface DriverError {
  driver: LogDriver;
  logEntry: LumberjackLog;
  error: unknown;
}

/**
 * Service responsible to add logs to the applications.
 *
 * It's API provides a single `log` method, which will load all `log-drivers`
 * provided through the application.
 *
 *
 */
@Injectable({ providedIn: LumberjackRootModule })
export class LumberjackService {
  private logDrivers: LogDriver[];

  constructor(
    @Inject(lumberjackLogConfigToken) private config: LumberjackLogConfig,
    // Each driver must be provided with multi. That way we can capture every provided driver
    // and use it to log to its output.
    @Optional() @Inject(logDriverToken) logDrivers: LogDriver[],
    private time: LumberjackTimeService
  ) {
    logDrivers = logDrivers || [];
    this.logDrivers = Array.isArray(logDrivers) ? logDrivers : [logDrivers];
  }

  log(logItem: LumberjackLog): void {
    const { format } = this.config;

    this.logWithHandleErrors(logItem, format, this.logDrivers);
  }

  logWithHandleErrors(
    logEntry: LumberjackLog,
    format: FormatFunction,
    drivers: LogDriver[],
    errors: DriverError[] = [],
    errorIndex = -1
  ): void {
    const greenDrivers: LogDriver[] = [];
    drivers.forEach((driver) => {
      if (this.canDriveLog(driver, logEntry.level)) {
        try {
          this.logToTheRightLevel(driver, logEntry, format);
          greenDrivers.push(driver);
          if (errorIndex > -1) {
            errors.splice(errorIndex, 1);
            errorIndex = -1;
          }
        } catch (error) {
          errors = [...errors, { error, driver, logEntry }];
        }
      }
    });
    this.processErrors(greenDrivers, format, errors);
  }

  private processErrors(greenDrivers: LogDriver[], format: FormatFunction, errors: DriverError[]) {
    if (greenDrivers.length === 0) {
      errors.forEach((error) => this.logDriverError(error));
    } else {
      errors.forEach((error, index) => {
        const logEntry: LumberjackLog = {
          context: 'Lumberjack Error Handling',
          createdAt: Date.now(),
          level: LumberjackLogLevel.Error,
          message: this.createDriverErrorMessage(error),
        };

        this.logWithHandleErrors(logEntry, format, greenDrivers, errors, index);
      });
    }
  }

  private defaultFormatFunction(logEntry: LumberjackLog) {
    const { context, createdAt: timestamp, level, message } = logEntry;
    return `${level} ${this.time.utcTimestampFor(timestamp)}${context ? ` [${context}]` : ''} ${message}`.trim();
  }

  private canDriveLog(driver: LogDriver, level: LumberjackLogEntryLevel): boolean {
    return (
      driver.config.levels === undefined ||
      (driver.config.levels.length === 1 && driver.config.levels[0] === LumberjackLogLevel.Verbose) ||
      (driver.config.levels as LumberjackLogEntryLevel[]).includes(level)
    );
  }

  private logDriverError({ driver, logEntry, error }: DriverError): void {
    const errorMessage = this.createDriverErrorMessage({ driver, logEntry, error });
    console.error(errorMessage);
  }

  private createDriverErrorMessage({ driver, logEntry, error }: DriverError): string {
    const thrownErrorMessage = (error as Error).message || String(error);
    return `Could not log message "${this.defaultFormatFunction(logEntry)}" to ${
      driver.constructor.name
    }.\n Error: "${thrownErrorMessage}"`;
  }

  private logToTheRightLevel(
    driver: LogDriver,
    logEntry: LumberjackLog,
    format: (logEntry: LumberjackLog) => string
  ): void {
    const logText = format(logEntry);

    switch (logEntry.level) {
      case LumberjackLogLevel.Info:
        driver.logInfo(logText);

        break;
      case LumberjackLogLevel.Error:
        driver.logError(logText);

        break;
      case LumberjackLogLevel.Warning:
        driver.logWarning(logText);

        break;
      case LumberjackLogLevel.Debug:
        driver.logDebug(logText);

        break;
      case LumberjackLogLevel.Critical:
        driver.logCritical(logText);

        break;
      case LumberjackLogLevel.Trace:
        driver.logTrace(logText);

        break;
    }
  }
}
