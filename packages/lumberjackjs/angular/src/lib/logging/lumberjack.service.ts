import { inject, Injectable } from '@angular/core';

import {
  createLumberjack,
  Lumberjack,
  LumberjackConfig,
  LumberjackDriver,
  LumberjackLog,
  LumberjackLogPayload,
} from '@lumberjackjs/core';

import { lumberjackConfigToken } from '../configuration/lumberjack-config.token';
import { lumberjackDriverToken } from '../drivers/lumberjack-driver.token';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

/**
 * Service with programmatic API to pass logs to Lumberjack. Optionally
 * supports a log payload.
 *
 * Lumberjack passes the logs to the registered drivers based on their
 * configurations.
 *
 * NOTE! Consider extending the `LumberjackLogger` or `ScopedLumberjackLogger`
 * base classes to set up predefined loggers unless you need a programmatic
 * API.
 */
@Injectable()
export class LumberjackService<TPayload extends LumberjackLogPayload | void = void> implements Lumberjack<TPayload> {
  /**
   * The registered drivers.
   */
  readonly #drivers = inject<LumberjackDriver<TPayload>[]>(lumberjackDriverToken, { optional: true }) ?? [];
  readonly #time = inject(LumberjackTimeService);
  readonly #config = inject<LumberjackConfig<TPayload>>(lumberjackConfigToken);

  readonly #lumberjack = createLumberjack<TPayload>({
    config: this.#config,
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
