import { LumberjackLog } from '../logs/lumberjack.log';

// tslint:disable-next-line: no-any
export interface LumberjackLogDriverLog<F extends Record<string, any> | undefined = undefined> {
  readonly formattedLog: string;
  readonly log: LumberjackLog<F>;
}
