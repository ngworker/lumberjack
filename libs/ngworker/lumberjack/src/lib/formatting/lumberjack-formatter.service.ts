import { Inject, Injectable } from '@angular/core';

import { lumberjackLogConfigToken } from '../configs/lumberjack-log-config.token';
import { LumberjackLogConfig } from '../configs/lumberjack-log.config';
import { LumberjackLog } from '../lumberjack-log';
import { LumberjackLogLevel } from '../lumberjack-log-levels';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

import { DriverError } from './../log-drivers/driver-error';
import { lumberjackFormat } from './lumberjack-format';
import { LumberjackFormatterResult } from './lumberjack-formatter-result';

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

  formatLogEntry(logEntry: LumberjackLog): LumberjackFormatterResult {
    const { format } = this.config;
    let result: LumberjackFormatterResult;

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
      level: LumberjackLogLevel.Error,
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
