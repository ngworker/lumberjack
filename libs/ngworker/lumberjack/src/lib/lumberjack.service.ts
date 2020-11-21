import { Inject, Injectable, Optional } from '@angular/core';

import { lumberjackLogConfigToken } from './configs/lumberjack-log-config.token';
import { LumberjackLogConfig } from './configs/lumberjack-log.config';
import { LogDriver, logDriverToken } from './log-drivers';
import { LumberjackLog } from './lumberjack-log';
import { LumberjackLogEntryLevel, LumberjackLogLevel } from './lumberjack-log-levels';
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
    @Inject(lumberjackLogConfigToken) private config: LumberjackLogConfig,
    // Each driver must be provided with multi. That way we can capture every provided driver
    // and use it to log to its output.
    @Optional() @Inject(logDriverToken) logDrivers: LogDriver[],
    private time: LumberjackTimeService
  ) {
    logDrivers = logDrivers || [];
    this.logDrivers = Array.isArray(logDrivers) ? logDrivers : [logDrivers];
  }

  log(logEntryParameter: LumberjackLog): void {
    const { logEntry, message } = this.formatLogEntry(logEntryParameter);

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

  private formatLogEntry(logEntry: LumberjackLog): { readonly logEntry: LumberjackLog; readonly message: string } {
    const { format } = this.config;

    try {
      return {
        logEntry,
        message: format(logEntry),
      };
    } catch (error) {
      const thrownErrorMessage = (error as Error).message || String(error);
      let createdAt: number;

      try {
        createdAt = this.time.getUnixEpochTicks();
      } catch {
        createdAt = Date.now();
      }

      const errorEntry: LumberjackLog = {
        context: 'LumberjackFormatError',
        createdAt,
        level: LumberjackLogLevel.Error,
        message: `Could not format message "${logEntry.message}". Error: "${thrownErrorMessage}"`,
      };
      let errorMessage = '';

      try {
        errorMessage = format(errorEntry);
      } catch {
        let utcTimestamp: string;

        try {
          utcTimestamp = this.time.utcTimestampFor(errorEntry.createdAt);
        } catch {
          utcTimestamp = new Date(errorEntry.createdAt).toISOString();
        }

        errorMessage = `${errorEntry.level} ${utcTimestamp}${errorEntry.context ? ` [${errorEntry.context}]` : ''} ${
          errorEntry.message
        }`;
      }

      return {
        logEntry: errorEntry,
        message: errorMessage,
      };
    }
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
