import { LumberjackLog } from '../lumberjack-log';
import { LumberjackLogConfigLevel } from '../lumberjack-log-levels';

export interface LumberjackLogConfig {
  format: (logEntry: LumberjackLog) => string;
  levels: LumberjackLogConfigLevel;
}
