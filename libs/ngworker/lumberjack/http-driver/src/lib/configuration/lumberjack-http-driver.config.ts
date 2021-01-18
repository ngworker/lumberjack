import { LumberjackHttpDriverInternalConfig } from './lumberjack-http-driver-internal.config';

export type LumberjackHttpDriverConfig = Omit<LumberjackHttpDriverInternalConfig, 'identifier'> &
  Partial<Pick<LumberjackHttpDriverInternalConfig, 'identifier'>>;
