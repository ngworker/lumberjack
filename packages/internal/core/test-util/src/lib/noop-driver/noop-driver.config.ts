import { LumberjackLogDriverConfig } from '@lumberjackjs/core';

export type NoopDriverConfig = Omit<LumberjackLogDriverConfig, 'identifier'> &
  Partial<Pick<LumberjackLogDriverConfig, 'identifier'>>;
