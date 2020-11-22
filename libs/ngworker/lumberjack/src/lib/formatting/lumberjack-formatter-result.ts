import { LumberjackLog } from '../lumberjack-log';

export interface LumberjackFormatterResult {
  readonly logEntry: LumberjackLog;
  readonly message: string;
}
