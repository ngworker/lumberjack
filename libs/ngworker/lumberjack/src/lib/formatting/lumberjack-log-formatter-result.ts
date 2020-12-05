import { LumberjackLog } from '../logs/lumberjack.log';

export interface LumberjackLogFormatterResult {
  readonly formattedLog: string;
  readonly log: LumberjackLog;
}
