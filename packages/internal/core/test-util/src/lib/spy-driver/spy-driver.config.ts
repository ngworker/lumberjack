import { LumberjackDriverConfig } from '@lumberjackjs/core';

export type SpyDriverConfig = Omit<LumberjackDriverConfig, 'identifier'> &
  Partial<Pick<LumberjackDriverConfig, 'identifier'>>;
