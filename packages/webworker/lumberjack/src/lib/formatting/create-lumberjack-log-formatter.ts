import { LumberjackLog, LumberjackLogFormatterResult } from '@webworker/lumberjack';

import { LumberjackConfig } from '../configuration/lumberjack.config';
import { LumberjackLevel } from '../logs/lumberjack-level';
import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';

import { lumberjackFormatLog } from './lumberjack-format-log';

interface LumberjackLogFormatterDependencies<TPayload extends LumberjackLogPayload | void> {
  readonly config: LumberjackConfig<TPayload>;
  readonly getUnixEpochTicks: () => number;
}

export type LumberjackLogFormatter<TPayload extends LumberjackLogPayload | void = void> = ReturnType<
  typeof createLumberjackLogFormatter<TPayload>
>;

export function createLumberjackLogFormatter<TPayload extends LumberjackLogPayload | void = void>(
  deps: LumberjackLogFormatterDependencies<TPayload>
) {
  function formatLog(log: LumberjackLog<TPayload>): LumberjackLogFormatterResult<TPayload> {
    const { format } = deps.config;
    let result: LumberjackLogFormatterResult<TPayload>;

    try {
      result = {
        log,
        formattedLog: format(log),
      };
    } catch (formattingError) {
      const formattingErrorLog = createFormattingErrorLog(formattingError, log);
      const formattedFormattingError = formatFormattingError(formattingErrorLog);

      result = {
        log: formattingErrorLog,
        formattedLog: formattedFormattingError,
      };
    }

    return result;
  }

  function createFormattingErrorLog(formatError: unknown, log: LumberjackLog<TPayload>): LumberjackLog<TPayload> {
    const formattingErrorMessage = (formatError as Error).message || String(formatError);

    return {
      scope: 'LumberjackLogFormattingError',
      createdAt: deps.getUnixEpochTicks(),
      level: LumberjackLevel.Error,
      message: `Could not format message "${log.message}". Error: "${formattingErrorMessage}"`,
      payload: undefined,
    };
  }

  function formatFormattingError(errorEntry: LumberjackLog<TPayload>): string {
    const { format } = deps.config;
    let errorMessage = '';

    try {
      errorMessage = format(errorEntry);
    } catch {
      errorMessage = lumberjackFormatLog(errorEntry);
    }

    return errorMessage;
  }

  return {
    formatLog,
  };
}
