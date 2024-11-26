import { TestBed } from '@angular/core/testing';

import {
  LumberjackLogDriverLog,
  LumberjackLogLevel,
  LumberjackLogPayload,
  LumberjackTimeService,
} from '@ngworker/lumberjack';

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
    createdAt: TestBed.inject(LumberjackTimeService).getUnixEpochTicks(),
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
): LumberjackLogDriverLog<TPayload> => createDriverLog(formattedLog, 'critical', message, scope, payload);

export const createDebugDriverLog = <TPayload extends LumberjackLogPayload | void = void>(
  formattedLog: string,
  message?: string,
  scope?: string,
  payload?: TPayload
): LumberjackLogDriverLog<TPayload> => createDriverLog(formattedLog, 'debug', message, scope, payload);

export const createErrorDriverLog = <TPayload extends LumberjackLogPayload | void = void>(
  formattedLog: string,
  message?: string,
  scope?: string,
  payload?: TPayload
): LumberjackLogDriverLog<TPayload> => createDriverLog(formattedLog, 'error', message, scope, payload);

export const createInfoDriverLog = <TPayload extends LumberjackLogPayload | void = void>(
  formattedLog: string,
  message?: string,
  scope?: string,
  payload?: TPayload
): LumberjackLogDriverLog<TPayload> => createDriverLog(formattedLog, 'info', message, scope, payload);

export const createTraceDriverLog = <TPayload extends LumberjackLogPayload | void = void>(
  formattedLog: string,
  message?: string,
  scope?: string,
  payload?: TPayload
): LumberjackLogDriverLog<TPayload> => createDriverLog(formattedLog, 'trace', message, scope, payload);

export const createWarningDriverLog = <TPayload extends LumberjackLogPayload | void = void>(
  formattedLog: string,
  message?: string,
  scope?: string,
  payload?: TPayload
): LumberjackLogDriverLog<TPayload> => createDriverLog(formattedLog, 'warn', message, scope, payload);
