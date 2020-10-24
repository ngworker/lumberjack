import { Inject, Injectable } from '@angular/core';

import { LogDriverConfig, StringLogDriver } from '@ngworker/lumberjack';

import { ConsoleDriverConfigToken } from './console-driver-config.token';

@Injectable()
export class ConsoleDriver implements StringLogDriver {
  constructor(@Inject(ConsoleDriverConfigToken) public config: LogDriverConfig) {}

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
