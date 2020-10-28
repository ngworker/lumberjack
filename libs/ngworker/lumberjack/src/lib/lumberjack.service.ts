import { Inject, Injectable, Optional } from '@angular/core';

import { LumberjackLogConfig, LumberjackLogConfigToken } from './configs/lumberjack-log.config';
import { LogDriver, LogDriverToken } from './log-drivers';
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
    @Inject(LumberjackLogConfigToken) private config: LumberjackLogConfig,
    // Each driver must be provided with multi. That way we can capture every provided driver
    // and use it to log to its output.
    @Optional() @Inject(LogDriverToken) logDrivers: LogDriver[]
  ) {
    logDrivers = logDrivers || [];
    this.logDrivers = Array.isArray(logDrivers) ? logDrivers : [logDrivers];
  }

  log(logItem: LumberjackLog): void {
    const { format } = this.config;

    for (const logDriver of this.logDrivers) {
      if (this.canDriveLog(logDriver, logItem.level)) {
        this.logToTheRightLevel(logDriver, logItem, format);
      }
    }
  }

  private canDriveLog(driver: LogDriver, level: LumberjackLogEntryLevel): boolean {
    return (
      driver.config.levels === undefined ||
      (driver.config.levels.length === 1 && driver.config.levels[0] === LumberjackLogLevel.Verbose) ||
      (driver.config.levels as LumberjackLogEntryLevel[]).includes(level)
    );
  }

  private logToTheRightLevel(
    driver: LogDriver,
    logEntry: LumberjackLog,
    format: (logEntry: LumberjackLog) => string
  ): void {
    const logMessage = format(logEntry);

    switch (logEntry.level) {
      case LumberjackLogLevel.Info:
        driver.logInfo(logMessage);

        break;
      case LumberjackLogLevel.Error:
        driver.logError(logMessage);

        break;
      case LumberjackLogLevel.Warning:
        driver.logWarning(logMessage);

        break;
      case LumberjackLogLevel.Debug:
        driver.logDebug(logMessage);

        break;
      case LumberjackLogLevel.Critical:
        driver.logCritical(logMessage);

        break;
      case LumberjackLogLevel.Trace:
        driver.logTrace(logMessage);

        break;
      default:
        driver.logInfo(logMessage);

        break;
    }
  }
}
