import { LumberjackLogDriverConfig } from '@lumberjackjs/core';

export type SpyDriverConfig = Omit<LumberjackLogDriverConfig, 'identifier'> &
  Partial<Pick<LumberjackLogDriverConfig, 'identifier'>>;
