import { LumberjackLog } from '../lumberjack-log';

export interface FormatLogEntryResult {
  readonly logEntry: LumberjackLog;
  readonly message: string;
}
