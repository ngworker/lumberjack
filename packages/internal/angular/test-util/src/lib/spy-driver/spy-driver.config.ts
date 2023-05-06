import { LumberjackLogDriverConfig } from '@webworker/lumberjack';

export type SpyDriverConfig = Omit<LumberjackLogDriverConfig, 'identifier'> &
  Partial<Pick<LumberjackLogDriverConfig, 'identifier'>>;
