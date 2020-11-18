import { Inject, Injectable } from '@angular/core';

import { LogDriver, LogDriverConfig } from '@ngworker/lumberjack';

import { errorThrowingDriverConfigToken } from './error-throwing-driver-config.token';

/**
 * Error-throwing log driver.
 *
 * Every logging method throws an error.
 */
@Injectable()
export class ErrorThrowingDriver implements LogDriver {
  constructor(@Inject(errorThrowingDriverConfigToken) public config: LogDriverConfig) {}

  logCritical(logEntry: string): void {
    this.throwError(logEntry);
  }

  logDebug(logEntry: string): void {
    this.throwError(logEntry);
  }

  logError(logEntry: string): void {
    this.throwError(logEntry);
  }

  logInfo(logEntry: string): void {
    this.throwError(logEntry);
  }

  logTrace(logEntry: string): void {
    this.throwError(logEntry);
  }

  logWarning(logEntry: string): void {
    this.throwError(logEntry);
  }

  private throwError(logEntry: string): never {
    throw new Error(`${ErrorThrowingDriver.name}: Failed to log "${logEntry}"`);
  }
}
