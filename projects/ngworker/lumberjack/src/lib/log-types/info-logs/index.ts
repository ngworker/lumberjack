import { createLog } from '../../log-creator';
import { LumberjackLogLevel } from '../../lumberjack-log-levels';
import { LumberjackLog } from '../../lumberjack-log';

export function createInfoLog(message: string, context: string = ''): () => LumberjackLog {
  return createLog(LumberjackLogLevel.Info, message, context);
}
