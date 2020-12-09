import { LumberjackLog } from '../logs/lumberjack.log';

// tslint:disable-next-line: no-any
export type LumberjackFormatFunction<F extends Readonly<{ [key: string]: unknown }> | void = void> = (
  log: LumberjackLog<F>
) => string;
