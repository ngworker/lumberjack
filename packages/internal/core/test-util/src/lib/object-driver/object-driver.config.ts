import { LumberjackDriverConfig } from '@lumberjackjs/core';

export type ObjectDriverConfig = Omit<LumberjackDriverConfig, 'identifier'> &
  Partial<Pick<LumberjackDriverConfig, 'identifier'>>;
