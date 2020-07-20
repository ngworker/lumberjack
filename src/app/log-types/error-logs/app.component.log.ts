import { createErrorLog, LumberjackLog } from '@ngworker/lumberjack';

function createAppErrorLog(message: string): () => LumberjackLog {
  return createErrorLog(message, 'AppComponent');
}

export const ForrestOnFire = createAppErrorLog('The forrest is on fire');
