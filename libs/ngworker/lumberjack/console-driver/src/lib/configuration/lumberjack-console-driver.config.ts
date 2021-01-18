import { LumberjackLogDriverConfig } from '@ngworker/lumberjack';

export type LumberjackConsoleDriverConfig = Omit<LumberjackLogDriverConfig, 'identifier'> &
  Partial<Pick<LumberjackLogDriverConfig, 'identifier'>>;
