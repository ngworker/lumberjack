import {
  LumberjackLogDriverLog,
  LumberjackLogEntryLevel,
  LumberjackLogLevel,
  LumberjackTimeService,
} from '@ngworker/lumberjack';

import { resolveDependency } from '../resolve-dependency';

export const createDriverLog = (
  formattedLog: string,
  level: LumberjackLogEntryLevel,
  message = '',
  context = 'Test'
): LumberjackLogDriverLog => ({
  formattedLog,
  log: {
    context,
    createdAt: resolveDependency(LumberjackTimeService).getUnixEpochTicks(),
    level,
    message,
  },
});
export const createCriticalDriverLog = (formattedLog: string, message?: string, context?: string) =>
  createDriverLog(formattedLog, LumberjackLogLevel.Critical, message, context);
export const createDebugDriverLog = (formattedLog: string, message?: string, context?: string) =>
  createDriverLog(formattedLog, LumberjackLogLevel.Debug, message, context);
export const createErrorDriverLog = (formattedLog: string, message?: string, context?: string) =>
  createDriverLog(formattedLog, LumberjackLogLevel.Error, message, context);
export const createInfoDriverLog = (formattedLog: string, message?: string, context?: string) =>
  createDriverLog(formattedLog, LumberjackLogLevel.Info, message, context);
export const createTraceDriverLog = (formattedLog: string, message?: string, context?: string) =>
  createDriverLog(formattedLog, LumberjackLogLevel.Trace, message, context);
export const createWarningDriverLog = (formattedLog: string, message?: string, context?: string) =>
  createDriverLog(formattedLog, LumberjackLogLevel.Warning, message, context);
