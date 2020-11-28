import { LumberjackLevel } from '@ngworker/lumberjack';

export interface HttpLogEntry {
  readonly logEntry: string;
  readonly level: LumberjackLevel;
  readonly origin: string;
}
