import { Inject, Injectable } from '@angular/core';

import { LumberjackLogDriver, LumberjackLogDriverConfig, LumberjackLogDriverLog } from '@ngworker/lumberjack';

import { errorThrowingDriverConfigToken } from './error-throwing-driver-config.token';
import { ErrorThrowingDriverConfig } from './error-throwing-driver.config';

/**
 * Error-throwing log driver.
 *
 * Every logging method throws an error after the configured number of logs.
 */
@Injectable()
export class ErrorThrowingDriver implements LumberjackLogDriver {
  private logCount = 0;

  constructor(@Inject(errorThrowingDriverConfigToken) public config: ErrorThrowingDriverConfig) {}

  logCritical({ formattedLog }: LumberjackLogDriverLog): void {
    if (this.logCount < this.config.logsBeforeThrowing) {
      this.logCount += 1;
    } else {
      this.throwError(formattedLog);
    }
  }

  logDebug({ formattedLog }: LumberjackLogDriverLog): void {
    if (this.logCount < this.config.logsBeforeThrowing) {
      this.logCount += 1;
    } else {
      this.throwError(formattedLog);
    }
  }

  logError({ formattedLog }: LumberjackLogDriverLog): void {
    if (this.logCount < this.config.logsBeforeThrowing) {
      this.logCount += 1;
    } else {
      this.throwError(formattedLog);
    }
  }

  logInfo({ formattedLog }: LumberjackLogDriverLog): void {
    if (this.logCount < this.config.logsBeforeThrowing) {
      this.logCount += 1;
    } else {
      this.throwError(formattedLog);
    }
  }

  logTrace({ formattedLog }: LumberjackLogDriverLog): void {
    if (this.logCount < this.config.logsBeforeThrowing) {
      this.logCount += 1;
    } else {
      this.throwError(formattedLog);
    }
  }

  logWarning({ formattedLog }: LumberjackLogDriverLog): void {
    if (this.logCount < this.config.logsBeforeThrowing) {
      this.logCount += 1;
    } else {
      this.throwError(formattedLog);
    }
  }

  private throwError(formattedLog: string): never {
    throw new Error(`${ErrorThrowingDriver.name}: Failed to log "${formattedLog}"`);
  }
}
