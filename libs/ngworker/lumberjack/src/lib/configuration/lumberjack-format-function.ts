import { LumberjackLog } from '../logs/lumberjack.log';

// tslint:disable-next-line: no-any
export type LumberjackFormatFunction<F extends Record<string, any> | undefined = undefined> = (
  log: LumberjackLog<F>
) => string;
