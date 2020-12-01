import { LumberjackLog } from '../logs/lumberjack-log';

export type LumberjackLogFormatFunction = (logEntry: LumberjackLog) => string;
