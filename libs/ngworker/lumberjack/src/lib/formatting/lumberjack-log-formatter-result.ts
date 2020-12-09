import { LumberjackLog } from '../logs/lumberjack.log';

export interface LumberjackLogFormatterResult<TPayload extends Readonly<{ [key: string]: unknown }> | void = void> {
  readonly formattedLog: string;
  readonly log: LumberjackLog<TPayload>;
}
