import { LumberjackLog } from '../logs/lumberjack.log';
import { Payload } from '../logs/payload';

import { utcTimestampFor } from './utc-timestamp-for';

export function lumberjackFormatLog<TPayload extends Payload | void = void>({
  scope,
  createdAt: timestamp,
  level,
  message,
}: LumberjackLog<TPayload>) {
  return `${level} ${utcTimestampFor(timestamp)}${scope ? ` [${scope}]` : ''} ${message}`;
}
