import { LumberjackLog } from '../logs/lumberjack.log';

import { utcTimestampFor } from './utc-timestamp-for';

// tslint:disable-next-line: no-any
export function lumberjackFormatLog<TPayload extends Readonly<{ [key: string]: unknown }> | void = void>({
  context,
  createdAt: timestamp,
  level,
  message,
}: LumberjackLog<TPayload>) {
  return `${level} ${utcTimestampFor(timestamp)}${context ? ` [${context}]` : ''} ${message}`;
}
