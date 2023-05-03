import { LumberjackLogDriverConfig } from '@webworker/lumberjack';

export type NoopDriverConfig = Omit<LumberjackLogDriverConfig, 'identifier'> &
  Partial<Pick<LumberjackLogDriverConfig, 'identifier'>>;
