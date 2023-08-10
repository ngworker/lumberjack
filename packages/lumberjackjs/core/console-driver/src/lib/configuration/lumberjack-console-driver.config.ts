import { LumberjackDriverConfig } from '@lumberjackjs/core';

/**
 * Settings used by the console driver.
 */
export type LumberjackConsoleDriverConfig = Omit<LumberjackDriverConfig, 'identifier'> &
  Partial<Pick<LumberjackDriverConfig, 'identifier'>>;
