import { Inject, Injectable } from '@angular/core';

import { LumberjackLogConfig, LumberjackLogConfigToken } from './configs/lumberjack-log.config';
import { LogDriver, LogDriverToken } from './log-drivers';
import { LumberjackLog } from './lumberjack-log';
import { LumberjackLogLevel } from './lumberjack-log-levels';

/**
 * Service responsible to add logs to the applications.
 *
 * It's API provides a single `log` method, which will load all `log-drivers`
 * provided through the application.
 *
 *
 */
@Injectable({ providedIn: 'root' })
export class LumberjackService {
  constructor(
    @Inject(LumberjackLogConfigToken) private config: LumberjackLogConfig,
    // Each driver must be provided with multi. That way we can capture every provided driver
    // and use it to log to its output.
    @Inject(LogDriverToken) private logDrivers: LogDriver[]
  ) {}

  log(logItem: LumberjackLog): void {
    const { format } = this.config;

    for (const logDriver of this.logDrivers) {
      if (this.canDriveLog(logDriver, logItem.level)) {
        this.logToTheRightLevel(logDriver, logItem, format);
      }
    }
  }

  private canDriveLog(driver: LogDriver, level: LumberjackLogLevel): boolean {
    return driver.config.levels === undefined || driver.config.levels.includes(level);
  }

  private logToTheRightLevel(
    driver: LogDriver,
    logItem: LumberjackLog,
    format: (logEntry: LumberjackLog) => string
  ): void {
    switch (logItem.level) {
      case LumberjackLogLevel.Info:
        driver.logInfo(format(logItem));

        break;
      case LumberjackLogLevel.Error:
        driver.logError(format(logItem));

        break;
      case LumberjackLogLevel.Warning:
        driver.logWarning(format(logItem));

        break;
      case LumberjackLogLevel.Debug:
        driver.logDebug(format(logItem));

        break;
      default:
        driver.logInfo(format(logItem));

        break;
    }
  }
}
