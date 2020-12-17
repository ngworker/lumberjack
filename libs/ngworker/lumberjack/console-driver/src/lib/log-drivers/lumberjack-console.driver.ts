import { Inject, Injectable } from '@angular/core';

import {
  LumberjackLogDriver,
  LumberjackLogDriverConfig,
  LumberjackLogDriverLog,
  LumberjackLogPayload,
} from '@ngworker/lumberjack';

import { lumberjackConsoleDriverConfigToken } from '../configuration/lumberjack-console-driver-config.token';
import { LumberjackConsole } from '../console/lumberjack-console';
import { lumberjackConsoleToken } from '../console/lumberjack-console.token';

@Injectable()
export class LumberjackConsoleDriver<TPayload extends LumberjackLogPayload | void = void>
  implements LumberjackLogDriver<TPayload> {
  constructor(
    @Inject(lumberjackConsoleDriverConfigToken) public config: LumberjackLogDriverConfig,
    @Inject(lumberjackConsoleToken) private console: LumberjackConsole
  ) {}

  logCritical({ formattedLog, log }: LumberjackLogDriverLog<TPayload>): void {
    this.console.error(formattedLog, log);
  }

  logDebug({ formattedLog, log }: LumberjackLogDriverLog<TPayload>): void {
    this.console.debug(formattedLog, log);
  }

  logError({ formattedLog, log }: LumberjackLogDriverLog<TPayload>): void {
    this.console.error(formattedLog, log);
  }

  logInfo({ formattedLog, log }: LumberjackLogDriverLog<TPayload>): void {
    this.console.info(formattedLog, log);
  }

  logTrace({ formattedLog, log }: LumberjackLogDriverLog<TPayload>): void {
    // tslint:disable-next-line: no-console
    this.console.trace(formattedLog, log);
  }

  logWarning({ formattedLog, log }: LumberjackLogDriverLog<TPayload>): void {
    this.console.warn(formattedLog, log);
  }
}
