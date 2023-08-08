import { LumberjackLogDriverConfig } from '@lumberjackjs/core';

import { LumberjackAngularHttpDriverInternalConfig } from './lumberjack-http-driver-internal.config';

/**
 * Settings exclusive to the HTTP driver.
 */
export type LumberjackAngularHttpDriverOptions = Omit<LumberjackAngularHttpDriverInternalConfig, keyof LumberjackLogDriverConfig> &
  Partial<LumberjackLogDriverConfig>;
