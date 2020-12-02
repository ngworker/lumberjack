import { LumberjackLog } from '../logs/lumberjack.log';

export type LumberjackFormatFunction = (log: LumberjackLog) => string;
