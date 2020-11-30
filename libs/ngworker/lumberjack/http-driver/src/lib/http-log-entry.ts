import { LumberjackLogLevel } from '@ngworker/lumberjack';

export interface HttpLogEntry {
  formattedLog: string;
  level: LumberjackLogLevel;
  origin: string;
}
