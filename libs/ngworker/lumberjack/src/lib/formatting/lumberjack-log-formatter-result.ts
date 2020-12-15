import { LumberjackLog } from '../logs/lumberjack.log';
import { Payload } from '../logs/payload';

export interface LumberjackLogFormatterResult<TPayload extends Payload | void = void> {
  readonly formattedLog: string;
  readonly log: LumberjackLog<TPayload>;
}
