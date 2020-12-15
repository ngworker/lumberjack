import { LumberjackLog } from '../logs/lumberjack.log';
import { Payload } from '../logs/payload';

// tslint:disable-next-line: no-any
export interface LumberjackLogDriverLog<TPayload extends Payload | void = void> {
  readonly formattedLog: string;
  readonly log: LumberjackLog<TPayload>;
}
