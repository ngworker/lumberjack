import { LumberjackLog, LumberjackLogPayload } from '@ngworker/lumberjack';

export interface LumberjackHttpLog<TPayload extends LumberjackLogPayload | void = void> {
  readonly formattedLog: string;
  readonly log: LumberjackLog<TPayload>;
  readonly origin: string;
}
