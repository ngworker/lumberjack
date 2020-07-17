import { LumberjackLog } from './Lumberjack-log';
import { LumberjackLogLevel } from './Lumberjack-log-levels';

export function createLog(level: LumberjackLogLevel, message: string, context?: string): () => LumberjackLog {
  return () => ({ level, message, context });
}
