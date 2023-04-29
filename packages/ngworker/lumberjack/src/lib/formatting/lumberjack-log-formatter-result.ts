import { LumberjackLog, LumberjackLogPayload } from '@webworkers/lumberjack';

export interface LumberjackLogFormatterResult<TPayload extends LumberjackLogPayload | void = void> {
  readonly formattedLog: string;
  readonly log: LumberjackLog<TPayload>;
}
