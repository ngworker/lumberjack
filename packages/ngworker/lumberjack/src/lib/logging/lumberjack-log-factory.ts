import { inject, Injectable } from '@angular/core';

import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

import { LumberjackLogBuilder } from './lumberjack-log.builder';

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
export class LumberjackLogFactory<TPayload extends LumberjackLogPayload | void = void> {
  readonly #time = inject(LumberjackTimeService);

  /**
   * Create a log builder for a critical log with the specified message.
   */
  createCriticalLog(message: string): LumberjackLogBuilder<TPayload> {
    return new LumberjackLogBuilder(this.#time, 'critical', message);
  }

  /**
   * Create a log builder for a debug log with the specified message.
   */
  createDebugLog(message: string): LumberjackLogBuilder<TPayload> {
    return new LumberjackLogBuilder(this.#time, 'debug', message);
  }

  /**
   * Create a log builder for an error log with the specified message.
   */
  createErrorLog(message: string): LumberjackLogBuilder<TPayload> {
    return new LumberjackLogBuilder(this.#time, 'error', message);
  }

  /**
   * Create a log builder for an info log with the specified message.
   */
  createInfoLog(message: string): LumberjackLogBuilder<TPayload> {
    return new LumberjackLogBuilder(this.#time, 'info', message);
  }

  /**
   * Create a log builder for a trace log with the specified message.
   */
  createTraceLog(message: string): LumberjackLogBuilder<TPayload> {
    return new LumberjackLogBuilder(this.#time, 'trace', message);
  }

  /**
   * Create a log builder for a warning log with the specified message.
   */
  createWarningLog(message: string): LumberjackLogBuilder<TPayload> {
    return new LumberjackLogBuilder(this.#time, 'warn', message);
  }
}
