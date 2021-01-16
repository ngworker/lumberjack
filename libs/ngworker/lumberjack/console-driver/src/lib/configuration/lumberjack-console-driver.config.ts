import { LumberjackLogDriverConfig } from '@ngworker/lumberjack';

type LumberjackLogDriverConfigWithPartialIdentifer = Omit<LumberjackLogDriverConfig, 'identifier'> &
  Partial<Pick<LumberjackLogDriverConfig, 'identifier'>>;

export type LumberjackConsoleDriverConfig = LumberjackLogDriverConfigWithPartialIdentifer;
