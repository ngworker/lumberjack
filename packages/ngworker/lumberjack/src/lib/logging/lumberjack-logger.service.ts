import { inject, Injectable } from '@angular/core';

import { LogLevel, LumberjackLogLevel } from '../logs/lumberjack-log-level';
import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

import { LumberjackLoggerBuilder } from './lumberjack-logger.builder';
import { LumberjackService } from './lumberjack.service';

/**
 * A logger holds methods that log a predefined log.
 *
 * Implement application- and library-specific loggers by extending this base
 * class. Optionally supports a log payload.
 *
 * Each protected method on this base class returns a logger builder.
 */
@Injectable()
export abstract class LumberjackLogger<TPayload extends LumberjackLogPayload | void = void> {
  protected readonly lumberjack = inject<LumberjackService<TPayload>>(LumberjackService);
  protected readonly time = inject(LumberjackTimeService);

  /**
   * Create a logger builder for a critical log with the specified message.
   */
  protected createCriticalLogger(message: string): LumberjackLoggerBuilder<TPayload> {
    return this.createLoggerBuilder('critical', message);
  }

  /**
   * Create a logger builder for a debug log with the specified message.
   */
  protected createDebugLogger(message: string): LumberjackLoggerBuilder<TPayload> {
    return this.createLoggerBuilder('debug', message);
  }

  /**
   * Create a logger builder for an error log with the specified message.
   */
  protected createErrorLogger(message: string): LumberjackLoggerBuilder<TPayload> {
    return this.createLoggerBuilder('error', message);
  }

  /**
   * Create a logger builder for an info log with the specified message.
   */
  protected createInfoLogger(message: string): LumberjackLoggerBuilder<TPayload> {
    return this.createLoggerBuilder('info', message);
  }

  /**
   * Create a logger builder for a trace log with the specified message.
   */
  protected createTraceLogger(message: string): LumberjackLoggerBuilder<TPayload> {
    return this.createLoggerBuilder('trace', message);
  }

  /**
   * Create a logger builder for a warning log with the specified message.
   */
  protected createWarningLogger(message: string): LumberjackLoggerBuilder<TPayload> {
    return this.createLoggerBuilder('warn', message);
  }

  /**
   * Create a logger builder for a log with the specified log level and message.
   */
  protected createLoggerBuilder(
    level: LumberjackLogLevel | LogLevel,
    message: string
  ): LumberjackLoggerBuilder<TPayload> {
    return new LumberjackLoggerBuilder<TPayload>(this.lumberjack, this.time, level, message);
  }
}
