import { Inject, Injectable, Optional } from '@angular/core';

import { LumberjackRootModule } from '../configuration/lumberjack-root.module';
import { formatLogDriverError } from '../formatting/format-log-driver-error';
import { LumberjackLogFormatter } from '../formatting/lumberjack-log-formatter.service';
import { LumberjackLogDriver } from '../log-drivers/lumberjack-log-driver';
import { LumberjackLogDriverError } from '../log-drivers/lumberjack-log-driver-error';
import { lumberjackLogDriverToken } from '../log-drivers/lumberjack-log-driver.token';
import { LumberjackLevel } from '../logs/lumberjack-level';
import { LumberjackLogLevel } from '../logs/lumberjack-log-level';
import { LumberjackLog } from '../logs/lumberjack.log';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

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
  private logDrivers: LumberjackLogDriver[];

  constructor(
    // Each driver must be provided with multi. That way we can capture every provided driver
    // and use it to log to its output.
    @Optional() @Inject(lumberjackLogDriverToken) logDrivers: LumberjackLogDriver[],
    private logFormatter: LumberjackLogFormatter,
    private time: LumberjackTimeService
  ) {
    logDrivers = logDrivers || [];
    this.logDrivers = Array.isArray(logDrivers) ? logDrivers : [logDrivers];
  }

  log(logEntryParameter: LumberjackLog): void {
    const { log: logEntry, formattedLog: message } = this.logFormatter.formatLog(logEntryParameter);

    this.logWithHandleErrors(logEntry, message, this.logDrivers);
  }

  private canDriveLog(driver: LumberjackLogDriver, level: LumberjackLogLevel): boolean {
    return (
      driver.config.levels === undefined ||
      (driver.config.levels.length === 1 && driver.config.levels[0] === LumberjackLevel.Verbose) ||
      (driver.config.levels as LumberjackLogLevel[]).includes(level)
    );
  }

  private createDriverErrorLog(driverError: LumberjackLogDriverError): LumberjackLog {
    return {
      context: 'LumberjackLogDriverError',
      createdAt: this.time.getUnixEpochTicks(),
      level: LumberjackLevel.Error,
      message: formatLogDriverError(driverError),
    };
  }

  private logDriverError(driverError: LumberjackLogDriverError): void {
    const errorMessage = formatLogDriverError(driverError);

    console.error(errorMessage);
  }

  private logToTheRightLevel(driver: LumberjackLogDriver, level: LumberjackLogLevel, formattedMessage: string): void {
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

  private logWithHandleErrors(
    log: LumberjackLog,
    message: string,
    drivers: LumberjackLogDriver[],
    errors: LumberjackLogDriverError[] = [],
    errorIndex = -1
  ): void {
    const greenDrivers: LumberjackLogDriver[] = [];
    drivers.forEach((driver) => {
      if (this.canDriveLog(driver, log.level)) {
        try {
          this.logToTheRightLevel(driver, log.level, message);
          greenDrivers.push(driver);
          errorIndex = this.removeHandledError(errorIndex, errors);
        } catch (error) {
          errors = [...errors, { error, logDriver: driver, formattedLog: message }];
        }
      }
    });
    this.processErrors(greenDrivers, errors);
  }

  private logDriverErrorsToGreenDrivers(driverErrors: LumberjackLogDriverError[], greenDrivers: LumberjackLogDriver[]) {
    driverErrors.forEach((error, index) => {
      const driverErrorLog = this.createDriverErrorLog(error);

      this.logWithHandleErrors(driverErrorLog, driverErrorLog.message, greenDrivers, driverErrors, index);
    });
  }

  private outputUnhandledDriverErrors(driverErrors: ReadonlyArray<LumberjackLogDriverError>) {
    driverErrors.forEach((error) => this.logDriverError(error));
  }

  private processErrors(greenDrivers: LumberjackLogDriver[], errors: LumberjackLogDriverError[]) {
    if (greenDrivers.length === 0) {
      this.outputUnhandledDriverErrors(errors);
    } else {
      this.logDriverErrorsToGreenDrivers(errors, greenDrivers);
    }
  }

  private removeHandledError(errorIndex: number, errors: LumberjackLogDriverError[]) {
    if (errorIndex > -1) {
      errors.splice(errorIndex, 1);
      errorIndex = -1;
    }

    return errorIndex;
  }
}
