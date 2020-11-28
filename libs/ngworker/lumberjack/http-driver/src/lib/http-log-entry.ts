import { LumberjackLogLevel } from '@ngworker/lumberjack';

export interface HttpLogEntry {
  readonly logEntry: string;
  readonly level: LumberjackLogLevel;
  readonly origin: string;
}
