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
  private drivers: LumberjackLogDriver[];

  constructor(
    @Optional() @Inject(lumberjackLogDriverToken) drivers: LumberjackLogDriver[],
    private logFormatter: LumberjackLogFormatter,
    private time: LumberjackTimeService
  ) {
    drivers = drivers || [];
    this.drivers = Array.isArray(drivers) ? drivers : [drivers];
  }

  log(logParameter: LumberjackLog): void {
    const { log, formattedLog } = this.logFormatter.formatLog(logParameter);

    this.logWithHandleErrors(log, formattedLog, this.drivers);
  }

  private canDriveLog(driver: LumberjackLogDriver, logLevel: LumberjackLogLevel): boolean {
    return (
      driver.config.levels === undefined ||
      (driver.config.levels.length === 1 && driver.config.levels[0] === LumberjackLevel.Verbose) ||
      (driver.config.levels as LumberjackLogLevel[]).includes(logLevel)
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

  private driveLog(driver: LumberjackLogDriver, logLevel: LumberjackLogLevel, formattedLog: string): void {
    switch (logLevel) {
      case LumberjackLevel.Critical:
        driver.logCritical(formattedLog);

        break;
      case LumberjackLevel.Debug:
        driver.logDebug(formattedLog);

        break;
      case LumberjackLevel.Error:
        driver.logError(formattedLog);

        break;
      case LumberjackLevel.Info:
        driver.logInfo(formattedLog);

        break;
      case LumberjackLevel.Trace:
        driver.logTrace(formattedLog);

        break;
      case LumberjackLevel.Warning:
        driver.logWarning(formattedLog);

        break;
    }
  }

  private logWithHandleErrors(
    log: LumberjackLog,
    formattedLog: string,
    drivers: LumberjackLogDriver[],
    driverErors: LumberjackLogDriverError[] = [],
    errorIndex = -1
  ): void {
    const stableDrivers: LumberjackLogDriver[] = [];
    drivers.forEach((driver) => {
      if (this.canDriveLog(driver, log.level)) {
        try {
          this.driveLog(driver, log.level, formattedLog);
          stableDrivers.push(driver);
          errorIndex = this.removeHandledError(errorIndex, driverErors);
        } catch (error) {
          driverErors = [...driverErors, { error, logDriver: driver, formattedLog }];
        }
      }
    });
    this.processErrors(stableDrivers, driverErors);
  }

  private logDriverErrorsToStableDrivers(
    driverErrors: LumberjackLogDriverError[],
    greenDrivers: LumberjackLogDriver[]
  ) {
    driverErrors.forEach((error, index) => {
      const driverErrorLog = this.createDriverErrorLog(error);

      this.logWithHandleErrors(driverErrorLog, driverErrorLog.message, greenDrivers, driverErrors, index);
    });
  }

  private outputUnhandledDriverErrors(driverErrors: ReadonlyArray<LumberjackLogDriverError>) {
    driverErrors.forEach((error) => this.logDriverError(error));
  }

  private processErrors(stableDrivers: LumberjackLogDriver[], driverErrors: LumberjackLogDriverError[]) {
    if (stableDrivers.length === 0) {
      this.outputUnhandledDriverErrors(driverErrors);
    } else {
      this.logDriverErrorsToStableDrivers(driverErrors, stableDrivers);
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
