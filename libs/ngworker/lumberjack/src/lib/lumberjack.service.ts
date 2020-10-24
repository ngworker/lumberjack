import { Inject, Injectable, Optional } from '@angular/core';

import { LumberjackLogConfig, LumberjackLogConfigToken } from './configs/lumberjack-log.config';
import { ObjectLogDriver, ObjectLogDriverToken, StringLogDriver, StringLogDriverToken } from './log-drivers';
import { LogDriver } from './log-drivers/log-driver';
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
  private stringLogDrivers: StringLogDriver[];
  private objectLogDrivers: ObjectLogDriver[];

  constructor(
    @Inject(LumberjackLogConfigToken) private config: LumberjackLogConfig,
    // Each driver must be provided with multi. That way we can capture every provided driver
    // and use it to log to its output.
    @Optional() @Inject(StringLogDriverToken) stringLogDrivers: StringLogDriver[],
    @Optional() @Inject(ObjectLogDriverToken) objectLogDrivers: ObjectLogDriver[]
  ) {
    stringLogDrivers = stringLogDrivers || [];
    objectLogDrivers = objectLogDrivers || [];
    this.stringLogDrivers = Array.isArray(stringLogDrivers) ? stringLogDrivers : [stringLogDrivers];
    this.objectLogDrivers = Array.isArray(objectLogDrivers) ? objectLogDrivers : [objectLogDrivers];
  }

  log(logItem: LumberjackLog): void {
    const { format } = this.config;

    for (let index = 0; index < this.stringLogDrivers.length; index++) {
      const stringLogDriver = this.stringLogDrivers[index];
      if (this.canDriveLog(stringLogDriver, logItem.level)) {
        this.logStringToTheRightLevel(stringLogDriver, logItem, format);
      }
    }

    for (let index = 0; index < this.objectLogDrivers.length; index++) {
      const objectLogDriver = this.objectLogDrivers[index];
      if (this.canDriveLog(objectLogDriver, logItem.level)) {
        this.logObjectToTheRightLevel(objectLogDriver, logItem);
      }
    }
  }

  private canDriveLog(driver: StringLogDriver | ObjectLogDriver, level: LumberjackLogEntryLevel): boolean {
    return (
      driver.config.levels === undefined ||
      (driver.config.levels.length === 1 && driver.config.levels[0] === LumberjackLogLevel.Verbose) ||
      (driver.config.levels as LumberjackLogEntryLevel[]).includes(level)
    );
  }

  private logStringToTheRightLevel(
    driver: StringLogDriver,
    logItem: LumberjackLog,
    format: (logEntry: LumberjackLog) => string
  ): void {
    this.logToTheRightLevel(driver, logItem, format(logItem));
  }

  private logObjectToTheRightLevel(driver: ObjectLogDriver, logItem: LumberjackLog): void {
    this.logToTheRightLevel(driver, logItem, logItem);
  }

  private logToTheRightLevel<T>(driver: LogDriver<T>, logItem: LumberjackLog, logEntry: T): void {
    switch (logItem.level) {
      case LumberjackLogLevel.Info:
        driver.logInfo(logEntry);

        break;
      case LumberjackLogLevel.Error:
        driver.logError(logEntry);

        break;
      case LumberjackLogLevel.Warning:
        driver.logWarning(logEntry);

        break;
      case LumberjackLogLevel.Debug:
        driver.logDebug(logEntry);

        break;
      default:
        driver.logInfo(logEntry);

        break;
    }
  }
}
