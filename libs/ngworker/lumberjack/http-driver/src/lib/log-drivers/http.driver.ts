import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, NgZone } from '@angular/core';

import { LogDriver, LumberjackLevel } from '@ngworker/lumberjack';

import { httpDriverConfigToken } from '../configuration/http-driver-config.token';
import { HttpDriverConfig } from '../configuration/http-driver.config';
import { HttpLogEntry } from '../http-log-entry';
import { retryWithDelay } from '../retry-with-delay.operator';

@Injectable()
export class HttpDriver implements LogDriver {
  constructor(
    private http: HttpClient,
    @Inject(httpDriverConfigToken) public config: HttpDriverConfig,
    private ngZone: NgZone
  ) {}

  logCritical(logEntry: string): void {
    this.sendLog(logEntry, LumberjackLevel.Critical);
  }

  logDebug(logEntry: string): void {
    this.sendLog(logEntry, LumberjackLevel.Debug);
  }

  logError(logEntry: string): void {
    this.sendLog(logEntry, LumberjackLevel.Error);
  }

  logInfo(logEntry: string): void {
    this.sendLog(logEntry, LumberjackLevel.Info);
  }

  logTrace(logEntry: string): void {
    this.sendLog(logEntry, LumberjackLevel.Trace);
  }

  logWarning(logEntry: string): void {
    this.sendLog(logEntry, LumberjackLevel.Warning);
  }

  private sendLog(logEntry: string, level: LumberjackLevel): void {
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
