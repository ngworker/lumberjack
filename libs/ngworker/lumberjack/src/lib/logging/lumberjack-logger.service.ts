import { Injectable } from '@angular/core';

import { LumberjackLevel } from '../logs/lumberjack-level';
import { LumberjackLogLevel } from '../logs/lumberjack-log-level';
import { Payload } from '../logs/payload';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

import { LumberjackLoggerBuilder } from './lumberjack-logger.builder';
import { LumberjackService } from './lumberjack.service';

@Injectable()
export abstract class LumberjackLogger<TPayload extends Payload | void = void> {
  constructor(private lumberjack: LumberjackService<TPayload>, private time: LumberjackTimeService) {}

  protected createCriticalLogger(message: string): LumberjackLoggerBuilder<TPayload> {
    return this.createLoggerBuilder(LumberjackLevel.Critical, message);
  }

  protected createDebugLogger(message: string): LumberjackLoggerBuilder<TPayload> {
    return this.createLoggerBuilder(LumberjackLevel.Debug, message);
  }

  protected createErrorLogger(message: string): LumberjackLoggerBuilder<TPayload> {
    return this.createLoggerBuilder(LumberjackLevel.Error, message);
  }

  protected createInfoLogger(message: string): LumberjackLoggerBuilder<TPayload> {
    return this.createLoggerBuilder(LumberjackLevel.Info, message);
  }

  protected createTraceLogger(message: string): LumberjackLoggerBuilder<TPayload> {
    return this.createLoggerBuilder(LumberjackLevel.Trace, message);
  }

  protected createWarningLogger(message: string): LumberjackLoggerBuilder<TPayload> {
    return this.createLoggerBuilder(LumberjackLevel.Warning, message);
  }

  private createLoggerBuilder(level: LumberjackLogLevel, message: string): LumberjackLoggerBuilder<TPayload> {
    return new LumberjackLoggerBuilder<TPayload>(this.lumberjack, this.time, level, message);
  }
}
