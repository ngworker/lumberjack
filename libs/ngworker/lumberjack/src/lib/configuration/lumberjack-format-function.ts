import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';
import { LumberjackLog } from '../logs/lumberjack.log';

export type LumberjackFormatFunction<TPayload extends LumberjackLogPayload | void = void> = (
  log: LumberjackLog<TPayload>
) => string;
