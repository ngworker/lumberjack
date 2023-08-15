import { LumberjackLog } from '@lumberjackjs/core';

import { LumberjackConfig } from '../configuration/lumberjack.config';
import { LumberjackLevel } from '../logs/lumberjack-level';
import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';

import { lumberjackFormatLog } from './lumberjack-format-log';
import { LumberjackLogFormatter } from './lumberjack-log-formatter';
import { LumberjackLogFormatterResult } from './lumberjack-log-formatter-result';

interface LumberjackLogFormatterDependencies<TPayload extends LumberjackLogPayload | void> {
  readonly config: LumberjackConfig<TPayload>;
  readonly getUnixEpochTicks: () => number;
}

/**
 * Factory function that creates a Lumberjack log formatter function.
 *
 * @example
 * const formatter = createLumberjackLogFormatter(deps);
 *
 * const log = {
 *   scope: 'Application',
 *   createdAt: getUnixEpochTicks(),
 *   level: 'ERROR',
 *   message: 'An unexpected error occurred',
 * };
 *
 * console.log(formatter.formatLog(log));
 */
export function createLumberjackLogFormatter<TPayload extends LumberjackLogPayload | void = void>(
  deps: LumberjackLogFormatterDependencies<TPayload>
): LumberjackLogFormatter<TPayload> {
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
    const formattingErrorMessage = (formatError as Error).message ?? String(formatError);

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
