import { LumberjackHttpDriverConfig } from './lumberjack-http-driver.config';

export type LumberjackHttpDriverModuleConfig = Omit<LumberjackHttpDriverConfig, 'identifier'> &
  Partial<Pick<LumberjackHttpDriverConfig, 'identifier'>>;
