import { LumberjackLog } from '../logs/lumberjack.log';

// tslint:disable-next-line: no-any
export type LumberjackFormatFunction<TPayload extends Readonly<{ [key: string]: unknown }> | void = void> = (
  log: LumberjackLog<TPayload>
) => string;
