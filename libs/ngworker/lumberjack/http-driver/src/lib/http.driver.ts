import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, NgZone } from '@angular/core';

import { LogDriver, LumberjackLogDriverLog, LumberjackLogLevel } from '@ngworker/lumberjack';

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

  logCritical({ formattedLog }: LumberjackLogDriverLog): void {
    this.sendLog(formattedLog, LumberjackLogLevel.Critical);
  }

  logDebug({ formattedLog }: LumberjackLogDriverLog): void {
    this.sendLog(formattedLog, LumberjackLogLevel.Debug);
  }

  logError({ formattedLog }: LumberjackLogDriverLog): void {
    this.sendLog(formattedLog, LumberjackLogLevel.Error);
  }

  logInfo({ formattedLog }: LumberjackLogDriverLog): void {
    this.sendLog(formattedLog, LumberjackLogLevel.Info);
  }

  logTrace({ formattedLog }: LumberjackLogDriverLog): void {
    this.sendLog(formattedLog, LumberjackLogLevel.Trace);
  }

  logWarning({ formattedLog }: LumberjackLogDriverLog): void {
    this.sendLog(formattedLog, LumberjackLogLevel.Warning);
  }

  private sendLog(formattedLog: string, level: LumberjackLogLevel): void {
    const { origin, storeUrl, retryOptions } = this.config;
    const httpLogEntry: HttpLogEntry = { formattedLog, origin, level };

    this.ngZone.runOutsideAngular(() => {
      this.http
        .post<void>(storeUrl, httpLogEntry)
        .pipe(retryWithDelay(retryOptions.maxRetries, retryOptions.delayMs))
        .subscribe();
    });
  }
}
