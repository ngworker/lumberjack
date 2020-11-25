import { LumberjackLog } from './../lumberjack-log';

export type FormatFunction = (logEntry: LumberjackLog) => string;
