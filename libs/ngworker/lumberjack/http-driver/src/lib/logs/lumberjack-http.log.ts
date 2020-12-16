import { LumberjackLogLevel, Payload } from '@ngworker/lumberjack';

export interface LumberjackHttpLog<TPayload extends Payload | void = void> {
  readonly formattedLog: string;
  readonly level: LumberjackLogLevel;
  readonly origin: string;
  readonly payload?: TPayload;
}
