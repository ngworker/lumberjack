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

  logCritical(logEntry: string): void {
    if (this.logCount < this.config.logsBeforeThrowing) {
      this.logCount += 1;
    } else {
      this.throwError(logEntry);
    }
  }

  logDebug(logEntry: string): void {
    if (this.logCount < this.config.logsBeforeThrowing) {
      this.logCount += 1;
    } else {
      this.throwError(logEntry);
    }
  }

  logError(logEntry: string): void {
    if (this.logCount < this.config.logsBeforeThrowing) {
      this.logCount += 1;
    } else {
      this.throwError(logEntry);
    }
  }

  logInfo(logEntry: string): void {
    if (this.logCount < this.config.logsBeforeThrowing) {
      this.logCount += 1;
    } else {
      this.throwError(logEntry);
    }
  }

  logTrace(logEntry: string): void {
    if (this.logCount < this.config.logsBeforeThrowing) {
      this.logCount += 1;
    } else {
      this.throwError(logEntry);
    }
  }

  logWarning(logEntry: string): void {
    if (this.logCount < this.config.logsBeforeThrowing) {
      this.logCount += 1;
    } else {
      this.throwError(logEntry);
    }
  }

  private throwError(logEntry: string): never {
    throw new Error(`${ErrorThrowingDriver.name}: Failed to log "${logEntry}"`);
  }
}
