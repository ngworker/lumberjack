import { LumberjackLogConfig } from './lumberjack-log.config';
import { LumberjackLog } from '../lumberjack-log';

export const defaultLogConfig: LumberjackLogConfig = {
  format(logEntry: LumberjackLog): string {
    return `${logEntry.level.toString()}  ${new Date().toISOString()}  [${logEntry.context}] ${logEntry.message}`;
  },
};
