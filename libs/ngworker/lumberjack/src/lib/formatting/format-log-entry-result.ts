import { LumberjackLog } from '../lumberjack-log';

export interface FormatLogEntryResult {
  readonly log: LumberjackLog;
  readonly formattedLog: string;
}
