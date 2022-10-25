import { LumberjackLogDriverConfig } from '@ngworker/lumberjack';

export type ObjectDriverConfig = Omit<LumberjackLogDriverConfig, 'identifier'> &
  Partial<Pick<LumberjackLogDriverConfig, 'identifier'>>;
