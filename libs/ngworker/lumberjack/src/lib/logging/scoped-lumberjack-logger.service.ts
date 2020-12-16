import { Injectable } from '@angular/core';

import { LumberjackLogLevel } from '../logs/lumberjack-log-level';
import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

import { LumberjackLoggerBuilder } from './lumberjack-logger.builder';
import { LumberjackLogger } from './lumberjack-logger.service';
import { LumberjackService } from './lumberjack.service';

@Injectable()
export abstract class ScopedLumberjackLogger<
  TPayload extends LumberjackLogPayload | void = void
> extends LumberjackLogger<TPayload> {
  abstract readonly scope: string;

  constructor(protected lumberjack: LumberjackService<TPayload>, protected time: LumberjackTimeService) {
    super(lumberjack, time);
  }

  protected createLoggerBuilder(level: LumberjackLogLevel, message: string): LumberjackLoggerBuilder<TPayload> {
    return new LumberjackLoggerBuilder<TPayload>(this.lumberjack, this.time, level, message).withScope(this.scope);
  }
}
