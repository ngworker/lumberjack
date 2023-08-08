import { LumberjackAngularHttpDriverInternalConfig } from './lumberjack-http-driver-internal.config';

/**
 * Settings used by the HTTP driver.
 */
export type LumberjackAngularHttpDriverConfig = Omit<LumberjackAngularHttpDriverInternalConfig, 'identifier'> &
  Partial<Pick<LumberjackAngularHttpDriverInternalConfig, 'identifier'>>;
