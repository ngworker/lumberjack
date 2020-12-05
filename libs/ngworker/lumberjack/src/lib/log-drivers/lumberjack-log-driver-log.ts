import { LumberjackLog } from '../logs/lumberjack.log';

export interface LumberjackLogDriverLog<TLog extends LumberjackLog = LumberjackLog> {
  readonly formattedLog: string;
  readonly log: TLog;
}
