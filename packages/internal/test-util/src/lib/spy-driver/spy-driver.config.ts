import { LumberjackLogDriverConfig } from '@ngworker/lumberjack';

export type SpyDriverConfig = Omit<LumberjackLogDriverConfig, 'identifier'> &
  Partial<Pick<LumberjackLogDriverConfig, 'identifier'>>;
