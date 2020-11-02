import { LumberjackLogLevel } from '@ngworker/lumberjack';

export interface HttpLogEntry {
  logEntry: string;
  level: LumberjackLogLevel;
  origin: string;
}
