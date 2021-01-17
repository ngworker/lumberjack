import { LumberjackLogDriverConfig } from '@ngworker/lumberjack';

import { LumberjackHttpDriverConfig } from './lumberjack-http-driver.config';

/**
 * Settings exclusive to the HTTP driver.
 */
export type LumberjackHttpDriverOptions = Omit<LumberjackHttpDriverConfig, keyof LumberjackLogDriverConfig>;
