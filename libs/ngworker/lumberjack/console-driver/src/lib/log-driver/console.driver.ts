import { Inject, Injectable } from '@angular/core';

import { LogDriver, LogDriverConfig } from '@ngworker/lumberjack';

import { consoleDriverConfigToken } from '../configuration/console-driver-config.token';
import { LumberjackConsole } from '../console/lumberjack-console';
import { lumberjackConsoleToken } from '../console/lumberjack-console.token';

@Injectable()
export class ConsoleDriver implements LogDriver {
  constructor(
    @Inject(consoleDriverConfigToken) public config: LogDriverConfig,
    @Inject(lumberjackConsoleToken) private console: LumberjackConsole
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
