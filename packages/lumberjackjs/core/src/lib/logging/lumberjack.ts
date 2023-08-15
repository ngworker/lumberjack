import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';
import { LumberjackLog } from '../logs/lumberjack.log';

export type Lumberjack<TPayload extends LumberjackLogPayload | void = void> = {
  log: (lumberjackLog: LumberjackLog<TPayload>) => void;
};
