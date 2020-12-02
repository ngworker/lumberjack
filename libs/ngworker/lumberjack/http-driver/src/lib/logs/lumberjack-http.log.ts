import { LumberjackLogLevel } from '@ngworker/lumberjack';

export interface LumberjackHttpLog {
  readonly formattedLog: string;
  readonly level: LumberjackLogLevel;
  readonly origin: string;
}
