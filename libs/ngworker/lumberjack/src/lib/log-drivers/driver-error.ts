import { LogDriver } from './log-driver';

export interface DriverError {
  driver: LogDriver;
  formattedLog: string;
  error: unknown;
}
