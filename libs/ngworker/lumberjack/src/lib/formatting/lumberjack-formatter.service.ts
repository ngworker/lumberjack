import { Inject, Injectable } from '@angular/core';

import { lumberjackConfigToken } from '../configuration/lumberjack-config.token';
import { LumberjackConfig } from '../configuration/lumberjack.config';
import { LumberjackLogDriverError } from '../log-drivers/lumberjack-log-driver-error';
import { LumberjackLevel } from '../logs/lumberjack-level';
import { LumberjackLog } from '../logs/lumberjack.log';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

import { FormatLogEntryResult } from './format-log-entry-result';
import { lumberjackFormat } from './lumberjack-format';

@Injectable({
  providedIn: 'root',
})
export class LumberjackFormatter {
  constructor(@Inject(lumberjackConfigToken) private config: LumberjackConfig, private time: LumberjackTimeService) {}

  formatDriverError({ driver, formattedMessage, error }: LumberjackLogDriverError): string {
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
