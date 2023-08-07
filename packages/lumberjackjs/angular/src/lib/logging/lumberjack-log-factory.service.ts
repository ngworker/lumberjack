import { inject, Injectable } from '@angular/core';

import { createLumberjackLogFactory, LumberjackLogFactory, LumberjackLogPayload } from '@lumberjackjs/core';

import { LumberjackTimeService } from '../time/lumberjack-time.service';

/**
 * Factory for a log builder with the specified log level and message.
 *
 * Use this to create a log before passing it to `LumberjackService`.
 *
 * Wraps `LumberjackLogBuilder`, supports dependency injection, and allows reuse
 * so that we don't have to new up log builders and pass `LumberjackTimeService`
 * to them.
 */
@Injectable()
export class LumberjackLogFactoryService<TPayload extends LumberjackLogPayload | void = void>
  implements LumberjackLogFactory<TPayload>
{
  readonly #time = inject(LumberjackTimeService);
  readonly #factory = createLumberjackLogFactory<TPayload>({
    getUnixEpochTicks: this.#time.getUnixEpochTicks.bind(this.#time),
  });

  /**
   * Create a log builder for a critical log with the specified message.
   */
  createCriticalLog = this.#factory.createCriticalLog;
  /**
   * Create a log builder for a debug log with the specified message.
   */
  createDebugLog = this.#factory.createDebugLog;
  /**
   * Create a log builder for an error log with the specified message.
   */
  createErrorLog = this.#factory.createErrorLog;
  /**
   * Create a log builder for an info log with the specified message.
   */
  createInfoLog = this.#factory.createInfoLog;
  /**
   * Create a log builder for a trace log with the specified message.
   */
  createTraceLog = this.#factory.createTraceLog;
  /**
   * Create a log builder for a warning log with the specified message.
   */
  createWarningLog = this.#factory.createWarningLog;
}
