import { LumberjackLevel, LumberjackLogLevel, LumberjackTimeService } from '@ngworker/lumberjack';

import { resolveDependency } from '../angular/resolve-dependency';

export const createLog = <TPayload extends Readonly<{ [key: string]: unknown }> | void = void>(
  level: LumberjackLogLevel,
  message = '',
  context = 'Test',
  payload?: TPayload
) => ({
  context,
  createdAt: resolveDependency(LumberjackTimeService).getUnixEpochTicks(),
  level,
  message,
  payload,
});

export const createCriticalLog = <TPayload extends Readonly<{ [key: string]: unknown }> | void = void>(
  message?: string,
  context?: string,
  payload?: TPayload
) => createLog(LumberjackLevel.Critical, message, context, payload);

export const createDebugLog = <TPayload extends Readonly<{ [key: string]: unknown }> | void = void>(
  message?: string,
  context?: string,
  payload?: TPayload
) => createLog(LumberjackLevel.Debug, message, context, payload);

export const createErrorLog = <TPayload extends Readonly<{ [key: string]: unknown }> | void = void>(
  message?: string,
  context?: string,
  payload?: TPayload
) => createLog(LumberjackLevel.Error, message, context, payload);

export const createInfoLog = <TPayload extends Readonly<{ [key: string]: unknown }> | void = void>(
  message?: string,
  context?: string,
  payload?: TPayload
) => createLog(LumberjackLevel.Info, message, context, payload);

export const createTraceLog = <TPayload extends Readonly<{ [key: string]: unknown }> | void = void>(
  message?: string,
  context?: string,
  payload?: TPayload
) => createLog(LumberjackLevel.Trace, message, context, payload);

export const createWarningLog = <TPayload extends Readonly<{ [key: string]: unknown }> | void = void>(
  message?: string,
  context?: string,
  payload?: TPayload
) => createLog(LumberjackLevel.Warning, message, context, payload);
