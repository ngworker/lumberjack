import { LumberjackLogDriverConfig } from '@webworker/lumberjack';

export type ObjectDriverConfig = Omit<LumberjackLogDriverConfig, 'identifier'> &
  Partial<Pick<LumberjackLogDriverConfig, 'identifier'>>;
