import { LumberjackLogDriverConfig } from '@ngworker/lumberjack';

/**
 * Settings used by the console driver.
 */
export type LumberjackConsoleDriverConfig = Omit<LumberjackLogDriverConfig, 'identifier'> &
  Partial<Pick<LumberjackLogDriverConfig, 'identifier'>>;
