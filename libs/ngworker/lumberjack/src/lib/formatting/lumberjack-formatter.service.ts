import { Inject, Injectable } from '@angular/core';

import { lumberjackLogConfigToken } from '../configs/lumberjack-log-config.token';
import { LumberjackLogConfig } from '../configs/lumberjack-log.config';
import { DriverError } from '../log-drivers/driver-error';
import { LumberjackLog } from '../lumberjack-log';
import { LumberjackLogLevel } from '../lumberjack-log-levels';
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

  formatDriverError({ driver, formattedLog, error }: DriverError): string {
    const thrownErrorMessage = (error as Error).message || String(error);

    return `Could not log message "${formattedLog}" to ${driver.constructor.name}.\n Error: "${thrownErrorMessage}"`;
  }

  formatLogEntry(log: LumberjackLog): FormatLogEntryResult {
    const { format } = this.config;
    let result: FormatLogEntryResult;

    try {
      result = {
        log,
        formattedLog: format(log),
      };
    } catch (error) {
      const errorLog = this.createErrorLog(error, log);
      const errorMessage = this.formatErrorMessage(errorLog);

      result = {
        log: errorLog,
        formattedLog: errorMessage,
      };
    }

    return result;
  }

  private createErrorLog(error: unknown, log: LumberjackLog): LumberjackLog {
    const thrownErrorMessage = (error as Error).message || String(error);

    return {
      context: 'LumberjackFormatError',
      createdAt: this.time.getUnixEpochTicks(),
      level: LumberjackLogLevel.Error,
      message: `Could not format message "${log.message}". Error: "${thrownErrorMessage}"`,
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
