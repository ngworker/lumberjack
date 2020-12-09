import { LumberjackLog } from '../logs/lumberjack.log';

export type LumberjackFormatFunction<TPayload extends Readonly<{ [key: string]: unknown }> | void = void> = (
  log: LumberjackLog<TPayload>
) => string;
