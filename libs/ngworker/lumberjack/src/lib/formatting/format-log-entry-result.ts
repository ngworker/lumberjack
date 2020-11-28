import { LumberjackLog } from '../logs/lumberjack-log';

export interface FormatLogEntryResult {
  readonly logEntry: LumberjackLog;
  readonly message: string;
}
