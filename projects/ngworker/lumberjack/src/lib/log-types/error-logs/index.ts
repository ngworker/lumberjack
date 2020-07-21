import { createLog } from '../../log-creator';
import { LumberjackLog } from '../../lumberjack-log';
import { LumberjackLogLevel } from '../../lumberjack-log-levels';

export function createErrorLog(message: string, context: string = ''): () => LumberjackLog {
  return createLog(LumberjackLogLevel.Error, message, context);
}
