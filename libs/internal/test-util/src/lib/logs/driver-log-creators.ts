import {
  LumberjackLevel,
  LumberjackLogDriverLog,
  LumberjackLogLevel,
  LumberjackLogPayload,
  LumberjackTimeService,
} from '@ngworker/lumberjack';

import { resolveDependency } from '../angular/resolve-dependency';

export const createDriverLog = <TPayload extends LumberjackLogPayload | void = void>(
  formattedLog: string,
  level: LumberjackLogLevel,
  message = '',
  scope = 'Test',
  payload?: TPayload
): LumberjackLogDriverLog<TPayload> => ({
  formattedLog,
  log: {
    scope,
    createdAt: resolveDependency(LumberjackTimeService).getUnixEpochTicks(),
    level,
    message,
    payload,
  },
});

export const createCriticalDriverLog = <TPayload extends LumberjackLogPayload | void = void>(
  formattedLog: string,
  message?: string,
  scope?: string,
  payload?: TPayload
) => createDriverLog(formattedLog, LumberjackLevel.Critical, message, scope, payload);

export const createDebugDriverLog = <TPayload extends LumberjackLogPayload | void = void>(
  formattedLog: string,
  message?: string,
  scope?: string,
  payload?: TPayload
) => createDriverLog(formattedLog, LumberjackLevel.Debug, message, scope, payload);

export const createErrorDriverLog = <TPayload extends LumberjackLogPayload | void = void>(
  formattedLog: string,
  message?: string,
  scope?: string,
  payload?: TPayload
) => createDriverLog(formattedLog, LumberjackLevel.Error, message, scope, payload);

export const createInfoDriverLog = <TPayload extends LumberjackLogPayload | void = void>(
  formattedLog: string,
  message?: string,
  scope?: string,
  payload?: TPayload
) => createDriverLog(formattedLog, LumberjackLevel.Info, message, scope, payload);

export const createTraceDriverLog = <TPayload extends LumberjackLogPayload | void = void>(
  formattedLog: string,
  message?: string,
  scope?: string,
  payload?: TPayload
) => createDriverLog(formattedLog, LumberjackLevel.Trace, message, scope, payload);

export const createWarningDriverLog = <TPayload extends LumberjackLogPayload | void = void>(
  formattedLog: string,
  message?: string,
  scope?: string,
  payload?: TPayload
) => createDriverLog(formattedLog, LumberjackLevel.Warning, message, scope, payload);
