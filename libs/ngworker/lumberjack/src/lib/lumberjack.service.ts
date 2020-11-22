import { Inject, Injectable, Optional } from '@angular/core';

import { LumberjackFormatter } from './formatting/lumberjack-formatter.service';
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

    for (const logDriver of this.logDrivers) {
      if (this.canDriveLog(logDriver, logEntry.level)) {
        try {
          this.logToTheRightLevel(logDriver, logEntry.level, message);
        } catch (error) {
          this.logDriverError(logDriver, message, error);
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

  private logDriverError(driver: LogDriver, formattedMessage: string, error: unknown): void {
    const thrownErrorMessage = (error && (error as Error).message) || String(error);
    const errorMessage = `Could not log message "${formattedMessage}" to ${driver.constructor.name}. Error: "${thrownErrorMessage}"`;
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
