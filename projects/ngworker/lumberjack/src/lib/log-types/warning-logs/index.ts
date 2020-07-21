import { createLog } from '../../log-creator';
import { LumberjackLog } from '../../lumberjack-log';
import { LumberjackLogLevel } from '../../lumberjack-log-levels';

export function createWarningLog(message: string, context: string = ''): () => LumberjackLog {
  return createLog(LumberjackLogLevel.Warning, message, context);
}
