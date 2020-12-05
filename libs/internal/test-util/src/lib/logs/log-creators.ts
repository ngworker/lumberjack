import { LumberjackLevel, LumberjackLogLevel, LumberjackTimeService } from '@ngworker/lumberjack';

import { resolveDependency } from '../angular/resolve-dependency';

const createLog = (level: LumberjackLogLevel, message = '', context = 'Test') => ({
  context,
  createdAt: resolveDependency(LumberjackTimeService).getUnixEpochTicks(),
  level,
  message,
});
export const createCriticalLog = (message?: string, context?: string) =>
  createLog(LumberjackLevel.Critical, message, context);
export const createDebugLog = (message?: string, context?: string) =>
  createLog(LumberjackLevel.Debug, message, context);
export const createErrorLog = (message?: string, context?: string) =>
  createLog(LumberjackLevel.Error, message, context);
export const createInfoLog = (message?: string, context?: string) => createLog(LumberjackLevel.Info, message, context);
export const createTraceLog = (message?: string, context?: string) =>
  createLog(LumberjackLevel.Trace, message, context);
export const createWarningLog = (message?: string, context?: string) =>
  createLog(LumberjackLevel.Warning, message, context);
