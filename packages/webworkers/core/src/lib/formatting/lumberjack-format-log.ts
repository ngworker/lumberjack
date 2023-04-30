import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';
import { LumberjackLog } from '../logs/lumberjack.log';
import { utcTimestampFor } from './utc-timestamp-for';

export function lumberjackFormatLog<TPayload extends LumberjackLogPayload | void = void>({
  scope,
  createdAt: timestamp,
  level,
  message,
}: LumberjackLog<TPayload>): string {
  const formattedScope = scope ? ` [${scope}]` : '';

  return `${level} ${utcTimestampFor(timestamp)}${formattedScope} ${message}`;
}
