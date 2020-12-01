import { LumberjackLevel } from '@ngworker/lumberjack';

export interface HttpLog {
  readonly logEntry: string;
  readonly level: LumberjackLevel;
  readonly origin: string;
}
