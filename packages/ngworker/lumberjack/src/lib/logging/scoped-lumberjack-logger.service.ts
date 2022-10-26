import { inject, Injectable } from '@angular/core';

import { LumberjackLogLevel } from '../logs/lumberjack-log-level';
import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

import { LumberjackLoggerBuilder } from './lumberjack-logger.builder';
import { LumberjackLogger } from './lumberjack-logger.service';
import { LumberjackService } from './lumberjack.service';

/**
 * A scoped logger holds methods that log a predefined log sharing a scope.
 *
 * Implement application- and library-specific loggers by extending this base
 * class. Optionally supports a log payload.
 *
 * Each protected method on this base class returns a logger builder with a
 * predefined scope.
 */
@Injectable()
export abstract class ScopedLumberjackLogger<
  TPayload extends LumberjackLogPayload | void = void
> extends LumberjackLogger<TPayload> {
  abstract readonly scope: string;

  protected override lumberjack = inject<LumberjackService<TPayload>>(LumberjackService);
  protected override time = inject(LumberjackTimeService);

  /**
   * Create a logger builder for a log with the shared scope as well as the
   * specified log level and message.
   */
  protected override createLoggerBuilder(
    level: LumberjackLogLevel,
    message: string
  ): LumberjackLoggerBuilder<TPayload> {
    return new LumberjackLoggerBuilder<TPayload>(this.lumberjack, this.time, level, message).withScope(this.scope);
  }
}
