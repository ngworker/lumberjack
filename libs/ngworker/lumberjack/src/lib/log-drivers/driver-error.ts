import { LogDriver } from './log-driver';

export interface DriverError {
  readonly driver: LogDriver;
  readonly formattedMessage: string;
  readonly error: unknown;
}
