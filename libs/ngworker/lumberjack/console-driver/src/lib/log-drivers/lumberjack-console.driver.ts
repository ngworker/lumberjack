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
