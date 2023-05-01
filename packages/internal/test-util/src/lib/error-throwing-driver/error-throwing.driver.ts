import { inject, Injectable } from '@angular/core';

import { LumberjackLogDriver, LumberjackLogDriverLog } from '@webworker/lumberjack';

import { errorThrowingDriverConfigToken } from './error-throwing-driver-config.token';

/**
 * Error-throwing log driver.
 *
 * Every logging method throws an error after the configured number of logs.
 */
@Injectable()
export class ErrorThrowingDriver implements LumberjackLogDriver {
  static readonly driverIdentifier = 'ErrorThrowingDriver';

  private logCount = 0;

  readonly config = inject(errorThrowingDriverConfigToken);

  logCritical({ formattedLog }: LumberjackLogDriverLog): void {
    this.log(formattedLog);
  }

  logDebug({ formattedLog }: LumberjackLogDriverLog): void {
    this.log(formattedLog);
  }

  logError({ formattedLog }: LumberjackLogDriverLog): void {
    this.log(formattedLog);
  }

  logInfo({ formattedLog }: LumberjackLogDriverLog): void {
    this.log(formattedLog);
  }

  logTrace({ formattedLog }: LumberjackLogDriverLog): void {
    this.log(formattedLog);
  }

  logWarning({ formattedLog }: LumberjackLogDriverLog): void {
    this.log(formattedLog);
  }

  private log(formattedLog: string): void | never {
    if (this.logCount < this.config.logsBeforeThrowing) {
      this.logCount += 1;
    } else {
      throw new Error(`${this.config.identifier}: Failed to log "${formattedLog}"`);
    }
  }
}
