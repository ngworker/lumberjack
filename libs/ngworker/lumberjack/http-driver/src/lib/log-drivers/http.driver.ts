import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, NgZone } from '@angular/core';

import { LumberjackLevel, LumberjackLogDriver } from '@ngworker/lumberjack';

import { httpDriverConfigToken } from '../configuration/http-driver-config.token';
import { HttpDriverConfig } from '../configuration/http-driver.config';
import { HttpLog } from '../logs/http.log';
import { retryWithDelay } from '../operators/retry-with-delay.operator';

@Injectable()
export class HttpDriver implements LumberjackLogDriver {
  constructor(
    private http: HttpClient,
    @Inject(httpDriverConfigToken) public config: HttpDriverConfig,
    private ngZone: NgZone
  ) {}

  logCritical(formattedLog: string): void {
    this.sendLog(formattedLog, LumberjackLevel.Critical);
  }

  logDebug(formattedLog: string): void {
    this.sendLog(formattedLog, LumberjackLevel.Debug);
  }

  logError(formattedLog: string): void {
    this.sendLog(formattedLog, LumberjackLevel.Error);
  }

  logInfo(formattedLog: string): void {
    this.sendLog(formattedLog, LumberjackLevel.Info);
  }

  logTrace(formattedLog: string): void {
    this.sendLog(formattedLog, LumberjackLevel.Trace);
  }

  logWarning(formattedLog: string): void {
    this.sendLog(formattedLog, LumberjackLevel.Warning);
  }

  private sendLog(formattedLog: string, level: LumberjackLevel): void {
    const { origin, storeUrl, retryOptions } = this.config;
    const httpLog: HttpLog = { formattedLog, origin, level };

    this.ngZone.runOutsideAngular(() => {
      this.http
        .post<void>(storeUrl, httpLog)
        .pipe(retryWithDelay(retryOptions.maxRetries, retryOptions.delayMs))
        .subscribe();
    });
  }
}
