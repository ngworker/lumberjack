import { Inject, Injectable } from '@angular/core';

import { LumberjackLogDriver, LumberjackLogDriverConfig } from '@ngworker/lumberjack';

import { lumberjackConsoleDriverConfigToken } from '../configuration/lumberjack-console-driver-config.token';
import { LumberjackConsole } from '../console/lumberjack-console';
import { lumberjackConsoleToken } from '../console/lumberjack-console.token';

@Injectable()
export class LumberjackConsoleDriver implements LumberjackLogDriver {
  constructor(
    @Inject(lumberjackConsoleDriverConfigToken) public config: LumberjackLogDriverConfig,
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