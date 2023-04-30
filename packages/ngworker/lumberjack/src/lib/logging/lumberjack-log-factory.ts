import { inject, Injectable } from '@angular/core';
import { LumberjackLevel, LumberjackLogPayload } from '@webworker/lumberjack';

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
    return new LumberjackLogBuilder(this.#time, LumberjackLevel.Critical, message);
  }

  /**
   * Create a log builder for a debug log with the specified message.
   */
  createDebugLog(message: string): LumberjackLogBuilder<TPayload> {
    return new LumberjackLogBuilder(this.#time, LumberjackLevel.Debug, message);
  }

  /**
   * Create a log builder for an error log with the specified message.
   */
  createErrorLog(message: string): LumberjackLogBuilder<TPayload> {
    return new LumberjackLogBuilder(this.#time, LumberjackLevel.Error, message);
  }

  /**
   * Create a log builder for an info log with the specified message.
   */
  createInfoLog(message: string): LumberjackLogBuilder<TPayload> {
    return new LumberjackLogBuilder(this.#time, LumberjackLevel.Info, message);
  }

  /**
   * Create a log builder for a trace log with the specified message.
   */
  createTraceLog(message: string): LumberjackLogBuilder<TPayload> {
    return new LumberjackLogBuilder(this.#time, LumberjackLevel.Trace, message);
  }

  /**
   * Create a log builder for a warning log with the specified message.
   */
  createWarningLog(message: string): LumberjackLogBuilder<TPayload> {
    return new LumberjackLogBuilder(this.#time, LumberjackLevel.Warning, message);
  }
}
