import { LumberjackDriver, LumberjackLogPayload } from '@lumberjackjs/core';

export type SpyDriver<TPayload extends LumberjackLogPayload | void = void> = LumberjackDriver<TPayload> &
  jest.Mocked<LumberjackDriver<TPayload>> & { reset: () => void };
