import { LumberjackLevel, LumberjackLogLevel, LumberjackLogPayload, LumberjackTimeService } from '@ngworker/lumberjack';

import { resolveDependency } from '../angular/resolve-dependency';

export const createLog = <TPayload extends LumberjackLogPayload | void = void>(
  level: LumberjackLogLevel,
  message = '',
  scope = 'Test',
  payload?: TPayload
) => ({
  scope,
  createdAt: resolveDependency(LumberjackTimeService).getUnixEpochTicks(),
  level,
  message,
  payload,
});

export const createCriticalLog = <TPayload extends LumberjackLogPayload | void = void>(
  message?: string,
  scope?: string,
  payload?: TPayload
) => createLog(LumberjackLevel.Critical, message, scope, payload);

export const createDebugLog = <TPayload extends LumberjackLogPayload | void = void>(
  message?: string,
  scope?: string,
  payload?: TPayload
) => createLog(LumberjackLevel.Debug, message, scope, payload);

export const createErrorLog = <TPayload extends LumberjackLogPayload | void = void>(
  message?: string,
  scope?: string,
  payload?: TPayload
) => createLog(LumberjackLevel.Error, message, scope, payload);

export const createInfoLog = <TPayload extends LumberjackLogPayload | void = void>(
  message?: string,
  scope?: string,
  payload?: TPayload
) => createLog(LumberjackLevel.Info, message, scope, payload);

export const createTraceLog = <TPayload extends LumberjackLogPayload | void = void>(
  message?: string,
  scope?: string,
  payload?: TPayload
) => createLog(LumberjackLevel.Trace, message, scope, payload);

export const createWarningLog = <TPayload extends LumberjackLogPayload | void = void>(
  message?: string,
  scope?: string,
  payload?: TPayload
) => createLog(LumberjackLevel.Warning, message, scope, payload);
