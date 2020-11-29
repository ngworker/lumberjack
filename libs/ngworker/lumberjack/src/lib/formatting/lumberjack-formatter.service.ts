import { Inject, Injectable } from '@angular/core';

import { lumberjackLogConfigToken } from '../configs/lumberjack-log-config.token';
import { LumberjackLogConfig } from '../configs/lumberjack-log.config';
import { DriverError } from '../log-drivers/driver-error';
import { LumberjackLevel } from '../logs/lumberjack-level';
import { LumberjackLog } from '../logs/lumberjack-log';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

import { FormatLogEntryResult } from './format-log-entry-result';
import { lumberjackFormat } from './lumberjack-format';

@Injectable({
  providedIn: 'root',
})
export class LumberjackFormatter {
  constructor(
    @Inject(lumberjackLogConfigToken) private config: LumberjackLogConfig,
    private time: LumberjackTimeService
  ) {}

  formatDriverError({ driver, formattedMessage, error }: DriverError): string {
    const thrownErrorMessage = (error as Error).message || String(error);

    return `Could not log message "${formattedMessage}" to ${driver.constructor.name}.\n Error: "${thrownErrorMessage}"`;
  }

  formatLogEntry(logEntry: LumberjackLog): FormatLogEntryResult {
    const { format } = this.config;
    let result: FormatLogEntryResult;

    try {
      result = {
        logEntry,
        message: format(logEntry),
      };
    } catch (error) {
      const errorLog = this.createErrorLog(error, logEntry);
      const errorMessage = this.formatErrorMessage(errorLog);

      result = {
        logEntry: errorLog,
        message: errorMessage,
      };
    }

    return result;
  }

  private createErrorLog(error: unknown, logEntry: LumberjackLog): LumberjackLog {
    const thrownErrorMessage = (error as Error).message || String(error);

    return {
      context: 'LumberjackFormatError',
      createdAt: this.time.getUnixEpochTicks(),
      level: LumberjackLevel.Error,
      message: `Could not format message "${logEntry.message}". Error: "${thrownErrorMessage}"`,
    };
  }

  private formatErrorMessage(errorEntry: LumberjackLog): string {
    const { format } = this.config;
    let errorMessage = '';

    try {
      errorMessage = format(errorEntry);
    } catch {
      errorMessage = lumberjackFormat(errorEntry);
    }

    return errorMessage;
  }
}
