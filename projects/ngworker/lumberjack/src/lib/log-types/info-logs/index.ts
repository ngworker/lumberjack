import { createLog } from '../../log-creator';
import { LumberjackLog } from '../../lumberjack-log';
import { LumberjackLogLevel } from '../../lumberjack-log-levels';

export function createInfoLog(message: string, context: string = ''): () => LumberjackLog {
  return createLog(LumberjackLogLevel.Info, message, context);
}
