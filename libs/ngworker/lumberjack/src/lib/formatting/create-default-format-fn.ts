import { LumberjackLog } from '../lumberjack-log';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

export function createDefaultFormatFn(time: LumberjackTimeService) {
  return function format({ context, createdAt: timestamp, level, message }: LumberjackLog) {
    return `${level} ${time.utcTimestampFor(timestamp)}${context ? ` [${context}]` : ''} ${message}`;
  };
}
