import { Inject, Injectable } from '@angular/core';

import { LogDriver, LogDriverConfig } from '@ngworker/lumberjack';

import { consoleDriverConfigToken } from './console-driver-config.token';
import { LumberjackConsole } from './lumberjack-console';
import { lumberjackConsoleToken } from './lumberjack-console.token';

@Injectable()
export class ConsoleDriver implements LogDriver {
  constructor(
    @Inject(consoleDriverConfigToken) public config: LogDriverConfig,
    @Inject(lumberjackConsoleToken) private console: LumberjackConsole
  ) {}

  logCritical(formattedLog: string): void {
    this.console.error(formattedLog);
  }

  logDebug(formattedLog: string): void {
    this.console.debug(formattedLog);
  }

  logError(formattedLog: string): void {
    this.console.error(formattedLog);
  }

  logInfo(formattedLog: string): void {
    this.console.info(formattedLog);
  }

  logTrace(formattedLog: string): void {
    // tslint:disable-next-line: no-console
    this.console.trace(formattedLog);
  }

  logWarning(formattedLog: string): void {
    this.console.warn(formattedLog);
  }
}
