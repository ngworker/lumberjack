import { LumberjackLogDriverConfig } from '@ngworker/lumberjack';

import { LumberjackHttpDriverConfig } from './lumberjack-http-driver.config';
export type HttpDriverOptions = Omit<LumberjackHttpDriverConfig, keyof LumberjackLogDriverConfig>;
