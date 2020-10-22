import { LumberjackLog } from './lumberjack-log';
import { LumberjackLogEntryLevel } from './lumberjack-log-levels';

// TODO(LayZeeDK): remove
export function createLog(level: LumberjackLogEntryLevel, message: string, context?: string): () => LumberjackLog {
  return () => ({ level, message, context, timestamp: 0 });
}
