import { LumberjackHttpDriverConfig } from './lumberjack-http-driver.config';

type LumberjackLogDriverConfigWithPartialIdentifer = Omit<LumberjackHttpDriverConfig, 'identifier'> &
  Partial<Pick<LumberjackHttpDriverConfig, 'identifier'>>;

export type LumberjackHttpDriverModuleConfig = LumberjackLogDriverConfigWithPartialIdentifer;
