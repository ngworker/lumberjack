import { LumberjackLevel, LumberjackLogLevel, LumberjackTimeService } from '@ngworker/lumberjack';

import { resolveDependency } from '../angular/resolve-dependency';

// tslint:disable-next-line: no-any
export const createLog = <F extends Record<string, any> | undefined = undefined>(
  level: LumberjackLogLevel,
  message = '',
  context = 'Test',
  extra?: F
) => ({
  context,
  createdAt: resolveDependency(LumberjackTimeService).getUnixEpochTicks(),
  level,
  message,
  extra,
});
// tslint:disable-next-line: no-any
export const createCriticalLog = <F extends Record<string, any> | undefined = undefined>(
  message?: string,
  context?: string,
  extra?: F
) => createLog(LumberjackLevel.Critical, message, context, extra);
// tslint:disable-next-line: no-any
export const createDebugLog = <F extends Record<string, any> | undefined = undefined>(
  message?: string,
  context?: string,
  extra?: F
) => createLog(LumberjackLevel.Debug, message, context, extra);
// tslint:disable-next-line: no-any
export const createErrorLog = <F extends Record<string, any> | undefined = undefined>(
  message?: string,
  context?: string,
  extra?: F
) => createLog(LumberjackLevel.Error, message, context, extra);
// tslint:disable-next-line: no-any
export const createInfoLog = <F extends Record<string, any> | undefined = undefined>(
  message?: string,
  context?: string,
  extra?: F
) => createLog(LumberjackLevel.Info, message, context, extra);
// tslint:disable-next-line: no-any
export const createTraceLog = <F extends Record<string, any> | undefined = undefined>(
  message?: string,
  context?: string,
  extra?: F
) => createLog(LumberjackLevel.Trace, message, context, extra);
// tslint:disable-next-line: no-any
export const createWarningLog = <F extends Record<string, any> | undefined = undefined>(
  message?: string,
  context?: string,
  extra?: F
) => createLog(LumberjackLevel.Warning, message, context, extra);
