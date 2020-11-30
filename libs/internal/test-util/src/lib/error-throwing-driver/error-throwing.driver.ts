import { Inject, Injectable } from '@angular/core';

import { LogDriver, LogDriverConfig } from '@ngworker/lumberjack';

import { ErrorThrowingDriverConfig, errorThrowingDriverConfigToken } from './error-throwing-driver-config.token';

/**
 * Error-throwing log driver.
 *
 * Every logging method throws an error.
 */
@Injectable()
export class ErrorThrowingDriver implements LogDriver {
  private logCount = 0;
  constructor(@Inject(errorThrowingDriverConfigToken) public config: ErrorThrowingDriverConfig) {}

  logCritical(formattedLog: string): void {
    if (this.logCount < this.config.logsBeforeThrowing) {
      this.logCount += 1;
    } else {
      this.throwError(formattedLog);
    }
  }

  logDebug(formattedLog: string): void {
    if (this.logCount < this.config.logsBeforeThrowing) {
      this.logCount += 1;
    } else {
      this.throwError(formattedLog);
    }
  }

  logError(formattedLog: string): void {
    if (this.logCount < this.config.logsBeforeThrowing) {
      this.logCount += 1;
    } else {
      this.throwError(formattedLog);
    }
  }

  logInfo(formattedLog: string): void {
    if (this.logCount < this.config.logsBeforeThrowing) {
      this.logCount += 1;
    } else {
      this.throwError(formattedLog);
    }
  }

  logTrace(formattedLog: string): void {
    if (this.logCount < this.config.logsBeforeThrowing) {
      this.logCount += 1;
    } else {
      this.throwError(formattedLog);
    }
  }

  logWarning(formattedLog: string): void {
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
