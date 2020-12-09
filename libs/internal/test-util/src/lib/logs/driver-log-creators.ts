import {
  LumberjackLevel,
  LumberjackLogDriverLog,
  LumberjackLogLevel,
  LumberjackTimeService,
} from '@ngworker/lumberjack';

import { resolveDependency } from '../angular/resolve-dependency';

// tslint:disable-next-line: no-any
export const createDriverLog = <TPayload extends Readonly<{ [key: string]: unknown }> | void = void>(
  formattedLog: string,
  level: LumberjackLogLevel,
  message = '',
  context = 'Test',
  payload?: TPayload
): LumberjackLogDriverLog<TPayload> => ({
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
export const createCriticalDriverLog = <TPayload extends Readonly<{ [key: string]: unknown }> | void = void>(
  formattedLog: string,
  message?: string,
  context?: string,
  payload?: TPayload
) => createDriverLog(formattedLog, LumberjackLevel.Critical, message, context, payload);
// tslint:disable-next-line: no-any
export const createDebugDriverLog = <TPayload extends Readonly<{ [key: string]: unknown }> | void = void>(
  formattedLog: string,
  message?: string,
  context?: string,
  payload?: TPayload
) => createDriverLog(formattedLog, LumberjackLevel.Debug, message, context, payload);
// tslint:disable-next-line: no-any
export const createErrorDriverLog = <TPayload extends Readonly<{ [key: string]: unknown }> | void = void>(
  formattedLog: string,
  message?: string,
  context?: string,
  payload?: TPayload
) => createDriverLog(formattedLog, LumberjackLevel.Error, message, context, payload);
// tslint:disable-next-line: no-any
export const createInfoDriverLog = <TPayload extends Readonly<{ [key: string]: unknown }> | void = void>(
  formattedLog: string,
  message?: string,
  context?: string,
  payload?: TPayload
) => createDriverLog(formattedLog, LumberjackLevel.Info, message, context, payload);
// tslint:disable-next-line: no-any
export const createTraceDriverLog = <TPayload extends Readonly<{ [key: string]: unknown }> | void = void>(
  formattedLog: string,
  message?: string,
  context?: string,
  payload?: TPayload
) => createDriverLog(formattedLog, LumberjackLevel.Trace, message, context, payload);
// tslint:disable-next-line: no-any
export const createWarningDriverLog = <TPayload extends Readonly<{ [key: string]: unknown }> | void = void>(
  formattedLog: string,
  message?: string,
  context?: string,
  payload?: TPayload
) => createDriverLog(formattedLog, LumberjackLevel.Warning, message, context, payload);
