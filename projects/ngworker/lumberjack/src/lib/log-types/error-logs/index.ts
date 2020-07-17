import { createLog } from '../../log-creator';
import { LumberjackLogLevel } from '../../Lumberjack-log-levels';
import { LumberjackLog } from '../../lumberjack-log';

export function createErrorLog(message: string, context: string = ''): () => LumberjackLog {
  return createLog(LumberjackLogLevel.Error, message, context);
}
