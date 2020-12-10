import { LumberjackLevel, LumberjackLogLevel, LumberjackTimeService } from '@ngworker/lumberjack';

import { resolveDependency } from '../angular/resolve-dependency';

export const createLog = <TPayload extends Readonly<{ [key: string]: unknown }> | void = void>(
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

export const createCriticalLog = <TPayload extends Readonly<{ [key: string]: unknown }> | void = void>(
  message?: string,
  scope?: string,
  payload?: TPayload
) => createLog(LumberjackLevel.Critical, message, scope, payload);

export const createDebugLog = <TPayload extends Readonly<{ [key: string]: unknown }> | void = void>(
  message?: string,
  scope?: string,
  payload?: TPayload
) => createLog(LumberjackLevel.Debug, message, scope, payload);

export const createErrorLog = <TPayload extends Readonly<{ [key: string]: unknown }> | void = void>(
  message?: string,
  scope?: string,
  payload?: TPayload
) => createLog(LumberjackLevel.Error, message, scope, payload);

export const createInfoLog = <TPayload extends Readonly<{ [key: string]: unknown }> | void = void>(
  message?: string,
  scope?: string,
  payload?: TPayload
) => createLog(LumberjackLevel.Info, message, scope, payload);

export const createTraceLog = <TPayload extends Readonly<{ [key: string]: unknown }> | void = void>(
  message?: string,
  scope?: string,
  payload?: TPayload
) => createLog(LumberjackLevel.Trace, message, scope, payload);

export const createWarningLog = <TPayload extends Readonly<{ [key: string]: unknown }> | void = void>(
  message?: string,
  scope?: string,
  payload?: TPayload
) => createLog(LumberjackLevel.Warning, message, scope, payload);
