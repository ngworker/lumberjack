import { LumberjackLogLevel, LumberjackLogPayload } from '@ngworker/lumberjack';

export interface LumberjackHttpLog<TPayload extends LumberjackLogPayload | void = void> {
  readonly formattedLog: string;
  readonly level: LumberjackLogLevel;
  readonly origin: string;
  readonly payload?: TPayload;
}
