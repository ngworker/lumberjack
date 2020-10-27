import { Inject, Injectable } from '@angular/core';

import { LogDriver, LogDriverConfig } from '@ngworker/lumberjack';

import { ConsoleDriverConfigToken } from './console-driver-config.token';

@Injectable()
export class ConsoleDriver implements LogDriver {
  constructor(@Inject(ConsoleDriverConfigToken) public config: LogDriverConfig) {}

  logDebug(logEntry: string): void {
    console.debug(logEntry);
  }

  logError(logEntry: string): void {
    console.error(logEntry);
  }

  logInfo(logEntry: string): void {
    console.info(logEntry);
  }

  logWarning(logEntry: string): void {
    console.warn(logEntry);
  }
}
