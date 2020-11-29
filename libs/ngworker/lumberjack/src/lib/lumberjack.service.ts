import { Inject, Injectable, Optional } from '@angular/core';

import { LumberjackFormatter } from './formatting/lumberjack-formatter.service';
import { DriverError } from './log-drivers/driver-error';
import { LogDriver } from './log-drivers/log-driver';
import { logDriverToken } from './log-drivers/log-driver.token';
import { LumberjackLevel } from './logs/lumberjack-level';
import { LumberjackLog } from './logs/lumberjack-log';
import { LumberjackLogLevel } from './logs/lumberjack-log-level';
import { LumberjackRootModule } from './lumberjack-root.module';
import { LumberjackTimeService } from './time/lumberjack-time.service';

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
    private formatter: LumberjackFormatter,
    private time: LumberjackTimeService
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
          errorIndex = this.removeHandledError(errorIndex, errors);
        } catch (error) {
          errors = [...errors, { error, driver, formattedMessage: message }];
        }
      }
    });
    this.processErrors(greenDrivers, errors);
  }

  private canDriveLog(driver: LogDriver, level: LumberjackLogLevel): boolean {
    return (
      driver.config.levels === undefined ||
      (driver.config.levels.length === 1 && driver.config.levels[0] === LumberjackLevel.Verbose) ||
      (driver.config.levels as LumberjackLogLevel[]).includes(level)
    );
  }

  private logToTheRightLevel(driver: LogDriver, level: LumberjackLogLevel, formattedMessage: string): void {
    switch (level) {
      case LumberjackLevel.Info:
        driver.logInfo(formattedMessage);

        break;
      case LumberjackLevel.Error:
        driver.logError(formattedMessage);

        break;
      case LumberjackLevel.Warning:
        driver.logWarning(formattedMessage);

        break;
      case LumberjackLevel.Debug:
        driver.logDebug(formattedMessage);

        break;
      case LumberjackLevel.Critical:
        driver.logCritical(formattedMessage);

        break;
      case LumberjackLevel.Trace:
        driver.logTrace(formattedMessage);

        break;
    }
  }

  private removeHandledError(errorIndex: number, errors: DriverError[]) {
    if (errorIndex > -1) {
      errors.splice(errorIndex, 1);
      errorIndex = -1;
    }
    return errorIndex;
  }

  private processErrors(greenDrivers: LogDriver[], errors: DriverError[]) {
    if (greenDrivers.length === 0) {
      this.outputUnhandledDriverErrors(errors);
    } else {
      this.logDriverErrorsToGreenDrivers(errors, greenDrivers);
    }
  }

  private logDriverErrorsToGreenDrivers(errors: DriverError[], greenDrivers: LogDriver[]) {
    errors.forEach((error, index) => {
      const logEntry: LumberjackLog = this.createDriverErrorEntry(error);

      this.logWithHandleErrors(logEntry, logEntry.message, greenDrivers, errors, index);
    });
  }

  private outputUnhandledDriverErrors(errors: DriverError[]) {
    errors.forEach((error) => this.logDriverError(error));
  }

  private createDriverErrorEntry(error: DriverError): LumberjackLog {
    return {
      context: 'LumberjackDriverError',
      createdAt: this.time.getUnixEpochTicks(),
      level: LumberjackLevel.Error,
      message: this.formatter.formatDriverError(error),
    };
  }

  private logDriverError(driverError: DriverError): void {
    const errorMessage = this.formatter.formatDriverError(driverError);
    console.error(errorMessage);
  }
}
