import { LumberjackHttpDriverInternalConfig } from './lumberjack-http-driver-internal.config';

/**
 * Settings used by the HTTP driver.
 */
export type LumberjackHttpDriverConfig = Omit<LumberjackHttpDriverInternalConfig, 'identifier'> &
  Partial<Pick<LumberjackHttpDriverInternalConfig, 'identifier'>>;
