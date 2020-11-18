import { Inject, Injectable, Optional, Type } from '@angular/core';

import { lumberjackLogConfigToken } from './configs/lumberjack-log-config.token';
import { LumberjackLogConfig } from './configs/lumberjack-log.config';
import { LogDriver, logDriverToken } from './log-drivers';
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
    @Inject(lumberjackLogConfigToken) private config: LumberjackLogConfig,
    // Each driver must be provided with multi. That way we can capture every provided driver
    // and use it to log to its output.
    @Optional() @Inject(logDriverToken) logDrivers: LogDriver[]
  ) {
    logDrivers = logDrivers || [];
    this.logDrivers = Array.isArray(logDrivers) ? logDrivers : [logDrivers];
  }

  log(logItem: LumberjackLog): void {
    const { format } = this.config;

    for (const logDriver of this.logDrivers) {
      if (this.canDriveLog(logDriver, logItem.level)) {
        try {
          this.logToTheRightLevel(logDriver, logItem, format);
        } catch (error) {
          this.logDriverError(logDriver, logItem, format, error);
        }
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

  private logDriverError(
    driver: LogDriver,
    logEntry: LumberjackLog,
    format: (logEntry: LumberjackLog) => string,
    error: unknown
  ): void {
    const thrownErrorMessage = (error as Error).message || String(error);
    const errorMessage = `Could not log message "${format(logEntry)}" to ${
      driver.constructor.name
    }. Error: "${thrownErrorMessage}"`;
    console.error(errorMessage);
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
