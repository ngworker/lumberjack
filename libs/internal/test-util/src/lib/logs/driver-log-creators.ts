import {
  LumberjackLevel,
  LumberjackLogDriverLog,
  LumberjackLogLevel,
  LumberjackTimeService,
} from '@ngworker/lumberjack';

import { resolveDependency } from '../angular/resolve-dependency';

// tslint:disable-next-line: no-any
export const createDriverLog = <F extends Record<string, unknown> | void = void>(
  formattedLog: string,
  level: LumberjackLogLevel,
  message = '',
  context = 'Test',
  payload?: F
): LumberjackLogDriverLog<F> => ({
  formattedLog,
  log: {
    context,
    createdAt: resolveDependency(LumberjackTimeService).getUnixEpochTicks(),
    level,
    message,
    payload,
  },
});
// tslint:disable-next-line: no-any
export const createCriticalDriverLog = <F extends Record<string, unknown> | void = void>(
  formattedLog: string,
  message?: string,
  context?: string,
  payload?: F
) => createDriverLog(formattedLog, LumberjackLevel.Critical, message, context, payload);
// tslint:disable-next-line: no-any
export const createDebugDriverLog = <F extends Record<string, unknown> | void = void>(
  formattedLog: string,
  message?: string,
  context?: string,
  payload?: F
) => createDriverLog(formattedLog, LumberjackLevel.Debug, message, context, payload);
// tslint:disable-next-line: no-any
export const createErrorDriverLog = <F extends Record<string, unknown> | void = void>(
  formattedLog: string,
  message?: string,
  context?: string,
  payload?: F
) => createDriverLog(formattedLog, LumberjackLevel.Error, message, context, payload);
// tslint:disable-next-line: no-any
export const createInfoDriverLog = <F extends Record<string, unknown> | void = void>(
  formattedLog: string,
  message?: string,
  context?: string,
  payload?: F
) => createDriverLog(formattedLog, LumberjackLevel.Info, message, context, payload);
// tslint:disable-next-line: no-any
export const createTraceDriverLog = <F extends Record<string, unknown> | void = void>(
  formattedLog: string,
  message?: string,
  context?: string,
  payload?: F
) => createDriverLog(formattedLog, LumberjackLevel.Trace, message, context, payload);
// tslint:disable-next-line: no-any
export const createWarningDriverLog = <F extends Record<string, unknown> | void = void>(
  formattedLog: string,
  message?: string,
  context?: string,
  payload?: F
) => createDriverLog(formattedLog, LumberjackLevel.Warning, message, context, payload);
