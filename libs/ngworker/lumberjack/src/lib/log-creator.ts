import { LumberjackLog } from './lumberjack-log';
import { LumberjackLogLevelComposable } from './lumberjack-log-levels';

export function createLog(level: LumberjackLogLevelComposable, message: string, context?: string): () => LumberjackLog {
  return () => ({ level, message, context });
}
