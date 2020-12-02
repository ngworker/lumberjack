import { LumberjackLog } from './../lumberjack-log';

export interface LumberjackLogDriverLog<T extends LumberjackLog = LumberjackLog> {
  formattedLog: string;
  log: T;
}
