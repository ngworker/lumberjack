import { LogDriver } from './log-driver';

export interface DriverError {
  driver: LogDriver;
  formattedMessage: string;
  error: unknown;
}
