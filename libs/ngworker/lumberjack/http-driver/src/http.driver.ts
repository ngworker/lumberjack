import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, NgZone } from '@angular/core';

import { LogDriver, LumberjackLogLevel } from '@ngworker/lumberjack';

import { HttpDriverConfig, HttpDriverConfigToken } from './http-driver-config.token';
import { retryWithDelay } from './retry-with-delay.operator';

interface HttpLogEntry {
  logEntry: string;
  level: LumberjackLogLevel;
  origin: string;
}

@Injectable()
export class HttpDriver implements LogDriver {
  constructor(
    private http: HttpClient,
    @Inject(HttpDriverConfigToken) public config: HttpDriverConfig,
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
    const { origin, storeUrl } = this.config;
    const httpLogEntry: HttpLogEntry = { logEntry, origin, level };

    this.ngZone.runOutsideAngular(() => {
      this.http.post<void>(storeUrl, httpLogEntry).pipe(retryWithDelay(5, 250)).subscribe();
    });
  }
}
