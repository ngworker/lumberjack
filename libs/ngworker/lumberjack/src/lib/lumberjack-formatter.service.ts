import { Inject, Injectable } from '@angular/core';

import { lumberjackLogConfigToken } from './configs/lumberjack-log-config.token';
import { LumberjackLogConfig } from './configs/lumberjack-log.config';
import { createDefaultFormatFn } from './formatting/create-default-format-fn';
import { LumberjackLog } from './lumberjack-log';
import { LumberjackLogLevel } from './lumberjack-log-levels';
import { LumberjackTimeService } from './time/lumberjack-time.service';

@Injectable({
  providedIn: 'root',
})
export class LumberjackFormatter {
  constructor(
    @Inject(lumberjackLogConfigToken) private config: LumberjackLogConfig,
    private time: LumberjackTimeService
  ) {}

  formatLogEntry(logEntry: LumberjackLog): { readonly logEntry: LumberjackLog; readonly message: string } {
    const { format } = this.config;

    try {
      return {
        logEntry,
        message: format(logEntry),
      };
    } catch (error) {
      const thrownErrorMessage = (error as Error).message || String(error);
      const errorEntry: LumberjackLog = {
        context: 'LumberjackFormatError',
        createdAt: this.time.getUnixEpochTicks(),
        level: LumberjackLogLevel.Error,
        message: `Could not format message "${logEntry.message}". Error: "${thrownErrorMessage}"`,
      };
      let errorMessage = '';

      try {
        errorMessage = format(errorEntry);
      } catch {
        const defaultFormat = createDefaultFormatFn(this.time);
        errorMessage = defaultFormat(errorEntry);
      }

      return {
        logEntry: errorEntry,
        message: errorMessage,
      };
    }
  }
}
