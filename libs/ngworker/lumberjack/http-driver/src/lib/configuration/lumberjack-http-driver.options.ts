import { LumberjackLogDriverConfig } from '@ngworker/lumberjack';

import { LumberjackHttpDriverConfig } from './lumberjack-http-driver.config';
export type LumberjackHttpDriverOptions = Omit<LumberjackHttpDriverConfig, keyof LumberjackLogDriverConfig>;
