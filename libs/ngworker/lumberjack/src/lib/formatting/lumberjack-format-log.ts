import { LumberjackLog } from '../logs/lumberjack.log';

import { utcTimestampFor } from './utc-timestamp-for';

export function lumberjackFormatLog<TPayload extends Readonly<{ [key: string]: unknown }> | void = void>({
  scope,
  createdAt: timestamp,
  level,
  message,
}: LumberjackLog<TPayload>) {
  return `${level} ${utcTimestampFor(timestamp)}${scope ? ` [${scope}]` : ''} ${message}`;
}
