import { Inject, Injectable } from '@angular/core';

import { LogDriver, LogDriverConfig } from '@ngworker/lumberjack';

import { ConsoleDriverConfigToken } from './console-driver-config.token';
import { LumberjackConsole } from './lumberjack-console';
import { LumberjackConsoleToken } from './lumberjack-console.token';

@Injectable()
export class ConsoleDriver implements LogDriver {
  constructor(
    @Inject(ConsoleDriverConfigToken) public config: LogDriverConfig,
    @Inject(LumberjackConsoleToken) private console: LumberjackConsole
  ) {}

  logCritical(logEntry: string): void {
    this.console.error(logEntry);
  }

  logDebug(logEntry: string): void {
    this.console.debug(logEntry);
  }

  logError(logEntry: string): void {
    this.console.error(logEntry);
  }

  logInfo(logEntry: string): void {
    this.console.info(logEntry);
  }

  logTrace(logEntry: string): void {
    // tslint:disable-next-line: no-console
    this.console.trace(logEntry);
  }

  logWarning(logEntry: string): void {
    this.console.warn(logEntry);
  }
}
