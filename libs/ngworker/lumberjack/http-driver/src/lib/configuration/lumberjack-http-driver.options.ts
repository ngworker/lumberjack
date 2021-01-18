import { LumberjackLogDriverConfig } from '@ngworker/lumberjack';

import { LumberjackHttpDriverInternalConfig } from './lumberjack-http-driver-internal.config';
export type LumberjackHttpDriverOptions = Omit<LumberjackHttpDriverInternalConfig, keyof LumberjackLogDriverConfig> &
  Partial<LumberjackLogDriverConfig>;
