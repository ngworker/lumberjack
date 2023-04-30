import { inject, Injectable } from '@angular/core';
import {
  LumberjackConfig,
  lumberjackFormatLog,
  LumberjackLevel,
  LumberjackLog,
  LumberjackLogFormatterResult,
  LumberjackLogPayload,
} from '@webworker/lumberjack';

import { lumberjackConfigToken } from '../configuration/lumberjack-config.token';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

@Injectable()
export class LumberjackLogFormatter<TPayload extends LumberjackLogPayload | void = void> {
  readonly #config = inject<LumberjackConfig<TPayload>>(lumberjackConfigToken);
  readonly #time = inject(LumberjackTimeService);

  formatLog(log: LumberjackLog<TPayload>): LumberjackLogFormatterResult<TPayload> {
    const { format } = this.#config;
    let result: LumberjackLogFormatterResult<TPayload>;

    try {
      result = {
        log,
        formattedLog: format(log),
      };
    } catch (formattingError) {
      const formattingErrorLog = this.#createFormattingErrorLog(formattingError, log);
      const formattedFormattingError = this.#formatFormattingError(formattingErrorLog);

      result = {
        log: formattingErrorLog,
        formattedLog: formattedFormattingError,
      };
    }

    return result;
  }

  #createFormattingErrorLog(formatError: unknown, log: LumberjackLog<TPayload>): LumberjackLog<TPayload> {
    const formattingErrorMessage = (formatError as Error).message ?? String(formatError);

    return {
      scope: 'LumberjackLogFormattingError',
      createdAt: this.#time.getUnixEpochTicks(),
      level: LumberjackLevel.Error,
      message: `Could not format message "${log.message}". Error: "${formattingErrorMessage}"`,
      payload: undefined,
    };
  }

  #formatFormattingError(errorEntry: LumberjackLog<TPayload>): string {
    const { format } = this.#config;
    let errorMessage = '';

    try {
      errorMessage = format(errorEntry);
    } catch {
      errorMessage = lumberjackFormatLog(errorEntry);
    }

    return errorMessage;
  }
}
