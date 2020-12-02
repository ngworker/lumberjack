import { LumberjackLogDriver } from './lumberjack-log-driver';

export interface LumberjackLogDriverError {
  readonly driver: LumberjackLogDriver;
  readonly formattedMessage: string;
  readonly error: unknown;
}
