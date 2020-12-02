import { LumberjackLogDriver } from './lumberjack-log-driver';

export interface DriverError {
  readonly driver: LumberjackLogDriver;
  readonly formattedMessage: string;
  readonly error: unknown;
}
