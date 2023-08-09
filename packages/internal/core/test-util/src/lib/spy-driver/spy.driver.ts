import { LumberjackLogDriver, LumberjackLogPayload } from '@lumberjackjs/core';

export type SpyDriver<TPayload extends LumberjackLogPayload | void = void> = LumberjackLogDriver<TPayload> &
  jest.Mocked<LumberjackLogDriver<TPayload>> & { reset: () => void };
