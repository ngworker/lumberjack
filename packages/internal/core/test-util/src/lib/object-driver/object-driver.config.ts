import { LumberjackLogDriverConfig } from '@lumberjackjs/core';

export type ObjectDriverConfig = Omit<LumberjackLogDriverConfig, 'identifier'> &
  Partial<Pick<LumberjackLogDriverConfig, 'identifier'>>;
