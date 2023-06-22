import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';
import { LumberjackLog } from '../logs/lumberjack.log';

import { utcTimestampFor } from './utc-timestamp-for';

/**
 * Default function used by Lumberjack to format the Lumberjack logs.
 *
 * This function formats a LumberjackLog object into a string with specific format:
 * "<level> <timestamp> [<scope>] <message>". If the scope is not provided, it will be omitted.
 *
 * @example
 * const log = {
 *  scope: 'Application',
 *  createdAt: new Date(),
 *  level: 'ERROR',
 *  message: 'An unexpected error occurred',
 * };
 *
 * console.log(lumberjackFormatLog(log));
 * // Outputs: "ERROR 2023-06-22T15:23:42Z [Application] An unexpected error occurred"
 *
 */
export function lumberjackFormatLog<TPayload extends LumberjackLogPayload | void = void>({
  scope,
  createdAt: timestamp,
  level,
  message,
}: LumberjackLog<TPayload>): string {
  const formattedScope = scope ? ` [${scope}]` : '';

  return `${level} ${utcTimestampFor(timestamp)}${formattedScope} ${message}`;
}
