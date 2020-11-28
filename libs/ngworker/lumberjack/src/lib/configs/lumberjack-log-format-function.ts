import { LumberjackLog } from '../lumberjack-log';

export type LumberjackLogFormatFunction = (logEntry: LumberjackLog) => string;
