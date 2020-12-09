import { LumberjackLevel, LumberjackLogLevel, LumberjackTimeService } from '@ngworker/lumberjack';

import { resolveDependency } from '../angular/resolve-dependency';

// tslint:disable-next-line: no-any
export const createLog = <F extends Readonly<{ [key: string]: unknown }> | void = void>(
  level: LumberjackLogLevel,
  message = '',
  context = 'Test',
  payload?: F
) => ({
  context,
  createdAt: resolveDependency(LumberjackTimeService).getUnixEpochTicks(),
  level,
  message,
  payload,
});
// tslint:disable-next-line: no-any
export const createCriticalLog = <F extends Readonly<{ [key: string]: unknown }> | void = void>(
  message?: string,
  context?: string,
  payload?: F
) => createLog(LumberjackLevel.Critical, message, context, payload);
// tslint:disable-next-line: no-any
export const createDebugLog = <F extends Readonly<{ [key: string]: unknown }> | void = void>(
  message?: string,
  context?: string,
  payload?: F
) => createLog(LumberjackLevel.Debug, message, context, payload);
// tslint:disable-next-line: no-any
export const createErrorLog = <F extends Readonly<{ [key: string]: unknown }> | void = void>(
  message?: string,
  context?: string,
  payload?: F
) => createLog(LumberjackLevel.Error, message, context, payload);
// tslint:disable-next-line: no-any
export const createInfoLog = <F extends Readonly<{ [key: string]: unknown }> | void = void>(
  message?: string,
  context?: string,
  payload?: F
) => createLog(LumberjackLevel.Info, message, context, payload);
// tslint:disable-next-line: no-any
export const createTraceLog = <F extends Readonly<{ [key: string]: unknown }> | void = void>(
  message?: string,
  context?: string,
  payload?: F
) => createLog(LumberjackLevel.Trace, message, context, payload);
// tslint:disable-next-line: no-any
export const createWarningLog = <F extends Readonly<{ [key: string]: unknown }> | void = void>(
  message?: string,
  context?: string,
  payload?: F
) => createLog(LumberjackLevel.Warning, message, context, payload);
