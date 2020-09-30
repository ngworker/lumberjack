import { Inject, Injectable } from '@angular/core';

import { LogDriver, LogDriverConfig, LogDriverConfigToken } from '@ngworker/lumberjack';

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
