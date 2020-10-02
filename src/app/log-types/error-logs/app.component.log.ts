import { createErrorLog, LumberjackLog } from '@ngworker/lumberjack';

function createAppErrorLog(message: string): () => LumberjackLog {
  return createErrorLog(message, 'AppComponent');
}

export const ForestOnFire = createAppErrorLog('The forest is on fire');
