import { LumberjackLog } from './lumberjack-log';
import { LumberjackLogLevel } from './lumberjack-log-levels';

export function createLog(level: LumberjackLogLevel, message: string, context?: string): () => LumberjackLog {
  return () => ({ level, message, context });
}
