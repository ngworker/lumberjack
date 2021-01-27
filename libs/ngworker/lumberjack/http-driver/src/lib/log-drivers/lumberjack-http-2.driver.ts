import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, NgZone } from '@angular/core';

import { LumberjackLog, LumberjackLogDriver, LumberjackLogDriverLog, LumberjackLogPayload } from '@ngworker/lumberjack';

import { lumberjackHttpDriverConfigToken } from '../configuration/lumberjack-http-driver-config.token';
import { LumberjackHttpDriverInternalConfig } from '../configuration/lumberjack-http-driver-internal.config';
import { LumberjackHttpLog } from '../logs/lumberjack-http.log';
import { retryWithDelay } from '../operators/retry-with-delay.operator';

/**
 * The HTTP driver transports logs to the configured web API log store using the
 * POST HTTP verb.
 *
 * It sends the formatted log and the log including the optional log payload.
 */
@Injectable()
export class LumberjackHttp2Driver<TPayload extends LumberjackLogPayload | void = void>
  implements LumberjackLogDriver<TPayload> {
  static driverIdentifier = 'LumberjackHttpDriver';
  constructor(
    private http: HttpClient,
    @Inject(lumberjackHttpDriverConfigToken) public config: LumberjackHttpDriverInternalConfig,
    private ngZone: NgZone
  ) {}

  /**
   * Send critical log to the log store.
   *
   * @param param0 The log and its text representation.
   */
  logCritical({ formattedLog, log }: LumberjackLogDriverLog<TPayload>): void {
    this.sendLog(formattedLog, log);
  }

  /**
   * Send debug log to the log store.
   *
   * @param param0 The log and its text representation.
   */
  logDebug({ formattedLog, log }: LumberjackLogDriverLog<TPayload>): void {
    this.sendLog(formattedLog, log);
  }

  /**
   * Send error log to the log store.
   *
   * @param param0 The log and its text representation.
   */
  logError({ formattedLog, log }: LumberjackLogDriverLog<TPayload>): void {
    this.sendLog(formattedLog, log);
  }

  /**
   * Send info log to the log store.
   *
   * @param param0 The log and its text representation.
   */
  logInfo({ formattedLog, log }: LumberjackLogDriverLog<TPayload>): void {
    this.sendLog(formattedLog, log);
  }

  /**
   * Send trace log to the log store.
   *
   * @param param0 The log and its text representation.
   */
  logTrace({ formattedLog, log }: LumberjackLogDriverLog<TPayload>): void {
    this.sendLog(formattedLog, log);
  }

  /**
   * Send warning log to the log store.
   *
   * @param param0 The log and its text representation.
   */
  logWarning({ formattedLog, log }: LumberjackLogDriverLog<TPayload>): void {
    this.sendLog(formattedLog, log);
  }

  /**
   * Send log to the log store.
   *
   * This is done outside of the `NgZone` as there's no need this to trigger
   * change detection.
   *
   * Failed HTTP requests are retried according to the configured retry options.
   *
   * @param formattedLog The log's text representation.
   * @param log The log.
   */
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
