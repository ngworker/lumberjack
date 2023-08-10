import { LumberjackDriverConfig } from '@lumberjackjs/core';

export type NoopDriverConfig = Omit<LumberjackDriverConfig, 'identifier'> &
  Partial<Pick<LumberjackDriverConfig, 'identifier'>>;
