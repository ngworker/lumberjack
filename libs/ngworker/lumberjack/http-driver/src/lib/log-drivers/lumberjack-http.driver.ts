import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, NgZone } from '@angular/core';

import { LumberjackLog, LumberjackLogDriver, LumberjackLogDriverLog, LumberjackLogPayload } from '@ngworker/lumberjack';

import { lumberjackHttpDriverConfigToken } from '../configuration/lumberjack-http-driver-config.token';
import { LumberjackHttpDriverInternalConfig } from '../configuration/lumberjack-http-driver-internal.config';
import { LumberjackHttpLog } from '../logs/lumberjack-http.log';
import { retryWithDelay } from '../operators/retry-with-delay.operator';

@Injectable()
export class LumberjackHttpDriver<TPayload extends LumberjackLogPayload | void = void>
  implements LumberjackLogDriver<TPayload> {
  constructor(
    private http: HttpClient,
    @Inject(lumberjackHttpDriverConfigToken) public config: LumberjackHttpDriverInternalConfig,
    private ngZone: NgZone
  ) {}

  logCritical({ formattedLog, log }: LumberjackLogDriverLog<TPayload>): void {
    this.sendLog(formattedLog, log);
  }

  logDebug({ formattedLog, log }: LumberjackLogDriverLog<TPayload>): void {
    this.sendLog(formattedLog, log);
  }

  logError({ formattedLog, log }: LumberjackLogDriverLog<TPayload>): void {
    this.sendLog(formattedLog, log);
  }

  logInfo({ formattedLog, log }: LumberjackLogDriverLog<TPayload>): void {
    this.sendLog(formattedLog, log);
  }

  logTrace({ formattedLog, log }: LumberjackLogDriverLog<TPayload>): void {
    this.sendLog(formattedLog, log);
  }

  logWarning({ formattedLog, log }: LumberjackLogDriverLog<TPayload>): void {
    this.sendLog(formattedLog, log);
  }

  private sendLog(formattedLog: string, log: LumberjackLog<TPayload>): void {
    const { origin, retryOptions, storeUrl } = this.config;
    const httpLog: LumberjackHttpLog<TPayload> = { formattedLog, origin, log };

    this.ngZone.runOutsideAngular(() => {
      this.http
        .post<void>(storeUrl, httpLog)
        .pipe(retryWithDelay(retryOptions.maxRetries, retryOptions.delayMs))
        .subscribe();
    });
  }
}
