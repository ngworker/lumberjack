import { LumberjackLevel } from '@ngworker/lumberjack';

export interface HttpLog {
  readonly formattedLog: string;
  readonly level: LumberjackLevel;
  readonly origin: string;
}
