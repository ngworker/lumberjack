import { LumberjackLogDriverConfig } from '@webworkers/lumberjack';

/**
 * Settings used by the console driver.
 */
export type LumberjackConsoleDriverConfig = Omit<LumberjackLogDriverConfig, 'identifier'> &
  Partial<Pick<LumberjackLogDriverConfig, 'identifier'>>;
