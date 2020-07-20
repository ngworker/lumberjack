import { createLog } from '../../log-creator';
import { LumberjackLogLevel } from '../../lumberjack-log-levels';
import { LumberjackLog } from '../../lumberjack-log';

export function createWarningLog(message: string, context: string = ''): () => LumberjackLog {
  return createLog(LumberjackLogLevel.Warning, message, context);
}
