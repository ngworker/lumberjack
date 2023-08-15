import { inject, Injectable } from '@angular/core';

import {
  createCriticalLogBuilder,
  createDebugLogBuilder,
  createErrorLogBuilder,
  createInfoLogBuilder,
  createTraceLogBuilder,
  createWarningLogBuilder,
  LumberjackLogPayload,
} from '@lumberjackjs/core';

import { LumberjackTimeService } from '../time/lumberjack-time.service';

/**
 * Factory for a log builder with the specified log level and message.
 *
 * Use this to create a log before passing it to `LumberjackOrchestrator`.
 *
 * Wraps `LumberjackLogBuilder`, supports dependency injection, and allows reuse
 * so that we don't have to new up log builders and pass `LumberjackTimeService`
 * to them.
 */
@Injectable()
export class LumberjackLogBuilderFactoryService<TPayload extends LumberjackLogPayload | void = void> {
  readonly #time = inject(LumberjackTimeService);
  readonly #getUnixEpochTicks = this.#time.getUnixEpochTicks.bind(this.#time);

  /**
   * Create a log builder for a critical log with the specified message.
   */
  createCriticalLog = createCriticalLogBuilder<TPayload>(this.#getUnixEpochTicks);
  /**
   * Create a log builder for a debug log with the specified message.
   */
  createDebugLog = createDebugLogBuilder<TPayload>(this.#getUnixEpochTicks);
  /**
   * Create a log builder for an error log with the specified message.
   */
  createErrorLog = createErrorLogBuilder<TPayload>(this.#getUnixEpochTicks);
  /**
   * Create a log builder for an info log with the specified message.
   */
  createInfoLog = createInfoLogBuilder<TPayload>(this.#getUnixEpochTicks);
  /**
   * Create a log builder for a trace log with the specified message.
   */
  createTraceLog = createTraceLogBuilder<TPayload>(this.#getUnixEpochTicks);
  /**
   * Create a log builder for a warning log with the specified message.
   */
  createWarningLog = createWarningLogBuilder<TPayload>(this.#getUnixEpochTicks);
}
