import { LumberjackLogDriver } from './lumberjack-log-driver';

export interface LumberjackLogDriverError {
  readonly formattedLog: string;
  readonly error: unknown;
  readonly logDriver: LumberjackLogDriver;
}
