import {
  LumberjackLevel,
  LumberjackLogDriverLog,
  LumberjackLogLevel,
  LumberjackTimeService,
} from '@ngworker/lumberjack';

import { resolveDependency } from '../angular/resolve-dependency';

export const createDriverLog = (
  formattedLog: string,
  level: LumberjackLogLevel,
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
  createDriverLog(formattedLog, LumberjackLevel.Critical, message, context);
export const createDebugDriverLog = (formattedLog: string, message?: string, context?: string) =>
  createDriverLog(formattedLog, LumberjackLevel.Debug, message, context);
export const createErrorDriverLog = (formattedLog: string, message?: string, context?: string) =>
  createDriverLog(formattedLog, LumberjackLevel.Error, message, context);
export const createInfoDriverLog = (formattedLog: string, message?: string, context?: string) =>
  createDriverLog(formattedLog, LumberjackLevel.Info, message, context);
export const createTraceDriverLog = (formattedLog: string, message?: string, context?: string) =>
  createDriverLog(formattedLog, LumberjackLevel.Trace, message, context);
export const createWarningDriverLog = (formattedLog: string, message?: string, context?: string) =>
  createDriverLog(formattedLog, LumberjackLevel.Warning, message, context);
