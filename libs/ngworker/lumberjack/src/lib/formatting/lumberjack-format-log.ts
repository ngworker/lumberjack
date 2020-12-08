import { LumberjackLog } from '../logs/lumberjack.log';

import { utcTimestampFor } from './utc-timestamp-for';

export function lumberjackFormatLog({ scope, createdAt: timestamp, level, message }: LumberjackLog) {
  return `${level} ${utcTimestampFor(timestamp)}${scope ? ` [${scope}]` : ''} ${message}`;
}
