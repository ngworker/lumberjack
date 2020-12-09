import { Inject, Injectable } from '@angular/core';

import { lumberjackConfigToken } from '../configuration/lumberjack-config.token';
import { LumberjackConfig } from '../configuration/lumberjack.config';
import { LumberjackLevel } from '../logs/lumberjack-level';
import { LumberjackLog } from '../logs/lumberjack.log';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

import { lumberjackFormatLog } from './lumberjack-format-log';
import { LumberjackLogFormatterResult } from './lumberjack-log-formatter-result';

@Injectable({
  providedIn: 'root',
})
// tslint:disable-next-line: no-any
export class LumberjackLogFormatter<F extends Readonly<{ [key: string]: unknown }> | void = void> {
  constructor(
    @Inject(lumberjackConfigToken) private config: LumberjackConfig<F>,
    private time: LumberjackTimeService
  ) {}

  formatLog(log: LumberjackLog<F>): LumberjackLogFormatterResult<F> {
    const { format } = this.config;
    let result: LumberjackLogFormatterResult<F>;

    try {
      result = {
        log,
        formattedLog: format(log),
      };
    } catch (formattingError) {
      const formattingErrorLog = this.createFormattingErrorLog(formattingError, log);
      const formattedFormattingError = this.formatFormattingError(formattingErrorLog);

      result = {
        log: formattingErrorLog,
        formattedLog: formattedFormattingError,
      };
    }

    return result;
  }

  private createFormattingErrorLog(formatError: unknown, log: LumberjackLog<F>): LumberjackLog<F> {
    const formattingErrorMessage = (formatError as Error).message || String(formatError);

    return {
      context: 'LumberjackLogFormattingError',
      createdAt: this.time.getUnixEpochTicks(),
      level: LumberjackLevel.Error,
      message: `Could not format message "${log.message}". Error: "${formattingErrorMessage}"`,
      payload: undefined,
    };
  }

  private formatFormattingError(errorEntry: LumberjackLog<F>): string {
    const { format } = this.config;
    let errorMessage = '';

    try {
      errorMessage = format(errorEntry as LumberjackLog<F>);
    } catch {
      errorMessage = lumberjackFormatLog(errorEntry);
    }

    return errorMessage;
  }
}
