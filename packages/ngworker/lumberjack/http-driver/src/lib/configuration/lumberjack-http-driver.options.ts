import { LumberjackLogDriverConfig } from '@webworker/lumberjack';

import { LumberjackHttpDriverInternalConfig } from './lumberjack-http-driver-internal.config';

/**
 * Settings exclusive to the HTTP driver.
 */
export type LumberjackHttpDriverOptions = Omit<LumberjackHttpDriverInternalConfig, keyof LumberjackLogDriverConfig> &
  Partial<LumberjackLogDriverConfig>;
