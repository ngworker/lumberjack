import {
  LumberjackLevel,
  LumberjackLogDriverLog,
  LumberjackLogLevel,
  LumberjackTimeService,
} from '@ngworker/lumberjack';

import { resolveDependency } from '../angular/resolve-dependency';

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

export const createCriticalDriverLog = <TPayload extends Readonly<{ [key: string]: unknown }> | void = void>(
  formattedLog: string,
  message?: string,
  context?: string,
  payload?: TPayload
) => createDriverLog(formattedLog, LumberjackLevel.Critical, message, context, payload);

export const createDebugDriverLog = <TPayload extends Readonly<{ [key: string]: unknown }> | void = void>(
  formattedLog: string,
  message?: string,
  context?: string,
  payload?: TPayload
) => createDriverLog(formattedLog, LumberjackLevel.Debug, message, context, payload);

export const createErrorDriverLog = <TPayload extends Readonly<{ [key: string]: unknown }> | void = void>(
  formattedLog: string,
  message?: string,
  context?: string,
  payload?: TPayload
) => createDriverLog(formattedLog, LumberjackLevel.Error, message, context, payload);

export const createInfoDriverLog = <TPayload extends Readonly<{ [key: string]: unknown }> | void = void>(
  formattedLog: string,
  message?: string,
  context?: string,
  payload?: TPayload
) => createDriverLog(formattedLog, LumberjackLevel.Info, message, context, payload);

export const createTraceDriverLog = <TPayload extends Readonly<{ [key: string]: unknown }> | void = void>(
  formattedLog: string,
  message?: string,
  context?: string,
  payload?: TPayload
) => createDriverLog(formattedLog, LumberjackLevel.Trace, message, context, payload);

export const createWarningDriverLog = <TPayload extends Readonly<{ [key: string]: unknown }> | void = void>(
  formattedLog: string,
  message?: string,
  context?: string,
  payload?: TPayload
) => createDriverLog(formattedLog, LumberjackLevel.Warning, message, context, payload);
