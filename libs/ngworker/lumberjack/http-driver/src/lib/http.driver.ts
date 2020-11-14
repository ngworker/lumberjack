import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, NgZone } from '@angular/core';

import { LogDriver, LumberjackLogLevel } from '@ngworker/lumberjack';

import { HttpDriverConfig, httpDriverConfigToken } from './http-driver-config.token';
import { HttpLogEntry } from './http-log-entry';
import { retryWithDelay } from './retry-with-delay.operator';

@Injectable()
export class HttpDriver implements LogDriver {
  constructor(
    private http: HttpClient,
    @Inject(httpDriverConfigToken) public config: HttpDriverConfig,
    private ngZone: NgZone
  ) {}

  logCritical(logEntry: string): void {
    this.sendLog(logEntry, LumberjackLogLevel.Critical);
  }

  logDebug(logEntry: string): void {
    this.sendLog(logEntry, LumberjackLogLevel.Debug);
  }

  logError(logEntry: string): void {
    this.sendLog(logEntry, LumberjackLogLevel.Error);
  }

  logInfo(logEntry: string): void {
    this.sendLog(logEntry, LumberjackLogLevel.Info);
  }

  logTrace(logEntry: string): void {
    this.sendLog(logEntry, LumberjackLogLevel.Trace);
  }

  logWarning(logEntry: string): void {
    this.sendLog(logEntry, LumberjackLogLevel.Warning);
  }

  private sendLog(logEntry: string, level: LumberjackLogLevel): void {
    const { origin, storeUrl, retryOptions } = this.config;
    const httpLogEntry: HttpLogEntry = { logEntry, origin, level };

    this.ngZone.runOutsideAngular(() => {
      this.http
        .post<void>(storeUrl, httpLogEntry)
        .pipe(retryWithDelay(retryOptions.maxRetries, retryOptions.delayMs))
        .subscribe();
    });
  }
}
