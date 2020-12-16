import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, NgZone } from '@angular/core';

import {
  LumberjackLevel,
  LumberjackLogDriver,
  LumberjackLogDriverLog,
  LumberjackLogLevel,
  LumberjackLogPayload,
} from '@ngworker/lumberjack';

import { lumberjackHttpDriverConfigToken } from '../configuration/lumberjack-http-driver-config.token';
import { LumberjackHttpDriverConfig } from '../configuration/lumberjack-http-driver.config';
import { LumberjackHttpLog } from '../logs/lumberjack-http.log';
import { retryWithDelay } from '../operators/retry-with-delay.operator';

@Injectable()
export class LumberjackHttpDriver<TPayload extends LumberjackLogPayload | void = void>
  implements LumberjackLogDriver<TPayload> {
  constructor(
    private http: HttpClient,
    @Inject(lumberjackHttpDriverConfigToken) public config: LumberjackHttpDriverConfig,
    private ngZone: NgZone
  ) {}

  logCritical({ formattedLog, log: { payload } }: LumberjackLogDriverLog<TPayload>): void {
    this.sendLog(formattedLog, LumberjackLevel.Critical, payload);
  }

  logDebug({ formattedLog, log: { payload } }: LumberjackLogDriverLog<TPayload>): void {
    this.sendLog(formattedLog, LumberjackLevel.Debug, payload);
  }

  logError({ formattedLog, log: { payload } }: LumberjackLogDriverLog<TPayload>): void {
    this.sendLog(formattedLog, LumberjackLevel.Error, payload);
  }

  logInfo({ formattedLog, log: { payload } }: LumberjackLogDriverLog<TPayload>): void {
    this.sendLog(formattedLog, LumberjackLevel.Info, payload);
  }

  logTrace({ formattedLog, log: { payload } }: LumberjackLogDriverLog<TPayload>): void {
    this.sendLog(formattedLog, LumberjackLevel.Trace, payload);
  }

  logWarning({ formattedLog, log: { payload } }: LumberjackLogDriverLog<TPayload>): void {
    this.sendLog(formattedLog, LumberjackLevel.Warning, payload);
  }

  private sendLog(formattedLog: string, logLevel: LumberjackLogLevel, payload?: TPayload): void {
    const { origin, retryOptions, storeUrl } = this.config;
    const httpLog: LumberjackHttpLog<TPayload> = { formattedLog, level: logLevel, origin, payload };

    this.ngZone.runOutsideAngular(() => {
      this.http
        .post<void>(storeUrl, httpLog)
        .pipe(retryWithDelay(retryOptions.maxRetries, retryOptions.delayMs))
        .subscribe();
    });
  }
}
