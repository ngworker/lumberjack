import { Inject, Injectable, Optional } from '@angular/core';

import { LumberjackFormatter } from './formatting/lumberjack-formatter.service';
import { LogDriver, logDriverToken } from './log-drivers';
import { DriverError } from './log-drivers/driver-error';
import { LumberjackLog } from './lumberjack-log';
import { LumberjackLogEntryLevel, LumberjackLogLevel } from './lumberjack-log-levels';
import { LumberjackRootModule } from './lumberjack-root.module';

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
    // Each driver must be provided with multi. That way we can capture every provided driver
    // and use it to log to its output.
    @Optional() @Inject(logDriverToken) logDrivers: LogDriver[],
    private formatter: LumberjackFormatter
  ) {
    logDrivers = logDrivers || [];
    this.logDrivers = Array.isArray(logDrivers) ? logDrivers : [logDrivers];
  }

  log(logEntryParameter: LumberjackLog): void {
    const { logEntry, message } = this.formatter.formatLogEntry(logEntryParameter);

    this.logWithHandleErrors(logEntry, message, this.logDrivers);
  }

  logWithHandleErrors(
    logEntry: LumberjackLog,
    message: string,
    drivers: LogDriver[],
    errors: DriverError[] = [],
    errorIndex = -1
  ): void {
    const greenDrivers: LogDriver[] = [];
    drivers.forEach((driver) => {
      if (this.canDriveLog(driver, logEntry.level)) {
        try {
          this.logToTheRightLevel(driver, logEntry.level, message);
          greenDrivers.push(driver);
          if (errorIndex > -1) {
            errors.splice(errorIndex, 1);
            errorIndex = -1;
          }
        } catch (error) {
          errors = [...errors, { error, driver, formattedMessage: message }];
        }
      }
    });
    this.processErrors(greenDrivers, errors);
  }

  private processErrors(greenDrivers: LogDriver[], errors: DriverError[]) {
    if (greenDrivers.length === 0) {
      errors.forEach((error) => this.logDriverError(error));
    } else {
      errors.forEach((error, index) => {
        const logEntry: LumberjackLog = {
          context: 'LumberjackDriverError',
          createdAt: Date.now(),
          level: LumberjackLogLevel.Error,
          message: this.formatter.formatDriverError(error),
        };

        this.logWithHandleErrors(logEntry, logEntry.message, greenDrivers, errors, index);
      });
    }
  }

  private canDriveLog(driver: LogDriver, level: LumberjackLogEntryLevel): boolean {
    return (
      driver.config.levels === undefined ||
      (driver.config.levels.length === 1 && driver.config.levels[0] === LumberjackLogLevel.Verbose) ||
      (driver.config.levels as LumberjackLogEntryLevel[]).includes(level)
    );
  }

  private logDriverError(driverError: DriverError): void {
    const errorMessage = this.formatter.formatDriverError(driverError);
    console.error(errorMessage);
  }

  private logToTheRightLevel(driver: LogDriver, level: LumberjackLogEntryLevel, formattedMessage: string): void {
    switch (level) {
      case LumberjackLogLevel.Info:
        driver.logInfo(formattedMessage);

        break;
      case LumberjackLogLevel.Error:
        driver.logError(formattedMessage);

        break;
      case LumberjackLogLevel.Warning:
        driver.logWarning(formattedMessage);

        break;
      case LumberjackLogLevel.Debug:
        driver.logDebug(formattedMessage);

        break;
      case LumberjackLogLevel.Critical:
        driver.logCritical(formattedMessage);

        break;
      case LumberjackLogLevel.Trace:
        driver.logTrace(formattedMessage);

        break;
    }
  }
}
