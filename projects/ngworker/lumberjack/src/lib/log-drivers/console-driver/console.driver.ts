import { LogDriverConfig } from '../../configs/log-driver.config';
import { LogDriver } from '../log-driver';

export class ConsoleDriver implements LogDriver {
  constructor(public config: LogDriverConfig) {}

  logInfo(logEntry: string): void {
    console.log(logEntry);
  }
  logDebug(logEntry: string): void {
    console.log(logEntry);
  }
  logError(logEntry: string): void {
    console.error(logEntry);
  }
  logWarning(logEntry: string): void {
    console.warn(logEntry);
  }
}
