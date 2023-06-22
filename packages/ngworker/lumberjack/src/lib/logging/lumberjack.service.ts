import { inject, Injectable } from '@angular/core';

import {
  createLumberjack,
  Lumberjack,
  LumberjackLog,
  LumberjackLogDriver,
  LumberjackLogPayload,
} from '@webworker/lumberjack';

import { LumberjackLogFormatterService } from '../formatting/lumberjack-log-formatter.service';
import { lumberjackLogDriverToken } from '../log-drivers/lumberjack-log-driver.token';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

/**
 * Service with programmatic API to pass logs to Lumberjack. Optionally
 * supports a log payload.
 *
 * Lumberjack passes the logs to the registered log drivers based on their
 * configurations.
 *
 * NOTE! Consider extending the `LumberjackLogger` or `ScopedLumberjackLogger`
 * base classes to set up predefined loggers unless you need a programmatic
 * API.
 */
@Injectable()
export class LumberjackService<TPayload extends LumberjackLogPayload | void = void> implements Lumberjack<TPayload> {
  /**
   * The registered log drivers.
   */
  readonly #drivers = inject<LumberjackLogDriver<TPayload>[]>(lumberjackLogDriverToken, { optional: true }) ?? [];
  readonly #logFormatter = inject<LumberjackLogFormatterService<TPayload>>(LumberjackLogFormatterService);
  readonly #time = inject(LumberjackTimeService);

  readonly #lumberjack = createLumberjack<TPayload>({
    logFormatter: this.#logFormatter,
    drivers: this.#drivers,
    getUnixEpochTicks: this.#time.getUnixEpochTicks.bind(this.#time),
  });

  /**
   * Pass a log to Lumberjack which will be forwarded to the registered log
   * drivers based on their configurations.
   *
   * NOTE! It's recommended to use `LumberjackLogBuilder` to create the log.
   *
   * @param lumberjackLog The Lumberjack log. Optionally supports a log payload.
   */
  log(lumberjackLog: LumberjackLog<TPayload>): void {
    this.#lumberjack.log(lumberjackLog);
  }
}
