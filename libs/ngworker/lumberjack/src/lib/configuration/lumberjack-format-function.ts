import { LumberjackLog } from '../logs/lumberjack.log';
import { Payload } from '../logs/payload';

export type LumberjackFormatFunction<TPayload extends Payload | void = void> = (log: LumberjackLog<TPayload>) => string;
