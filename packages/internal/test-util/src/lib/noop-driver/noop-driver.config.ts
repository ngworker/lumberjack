import { LumberjackLogDriverConfig } from '@ngworker/lumberjack';

export type NoopDriverConfig = Omit<LumberjackLogDriverConfig, 'identifier'> &
  Partial<Pick<LumberjackLogDriverConfig, 'identifier'>>;
