import { Inject, Injectable } from '@angular/core';

import { LogDriverConfig, LogDriverConfigToken } from '../../configs/log-driver.config';
import { LogDriver } from '../log-driver';

@Injectable()
export class ConsoleDriver implements LogDriver {
  constructor(@Inject(LogDriverConfigToken) public config: LogDriverConfig) {}

  logInfo(logEntry: string): void {
    console.info(logEntry);
  }
  logDebug(logEntry: string): void {
    console.debug(logEntry);
  }
  logError(logEntry: string): void {
    console.error(logEntry);
  }
  logWarning(logEntry: string): void {
    console.warn(logEntry);
  }
}
