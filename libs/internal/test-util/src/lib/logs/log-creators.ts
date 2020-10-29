import { LumberjackLogEntryLevel, LumberjackLogLevel, LumberjackTimeService } from '@ngworker/lumberjack';

import { resolveDependency } from '../resolve-dependency';

const createLog = (level: LumberjackLogEntryLevel, message = '', context = 'Test') => ({
  context,
  createdAt: resolveDependency(LumberjackTimeService).getUnixEpochTicks(),
  level,
  message,
});
export const createCriticalLog = (message?: string, context?: string) =>
  createLog(LumberjackLogLevel.Critical, message, context);
export const createDebugLog = (message?: string, context?: string) =>
  createLog(LumberjackLogLevel.Debug, message, context);
export const createErrorLog = (message?: string, context?: string) =>
  createLog(LumberjackLogLevel.Error, message, context);
export const createInfoLog = (message?: string, context?: string) =>
  createLog(LumberjackLogLevel.Info, message, context);
export const createTraceLog = (message?: string, context?: string) =>
  createLog(LumberjackLogLevel.Trace, message, context);
export const createWarningLog = (message?: string, context?: string) =>
  createLog(LumberjackLogLevel.Warning, message, context);
