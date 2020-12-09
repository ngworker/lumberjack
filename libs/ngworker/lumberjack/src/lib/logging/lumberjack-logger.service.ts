import { Injectable } from '@angular/core';

import { LumberjackLevel } from '../logs/lumberjack-level';
import { LumberjackLogLevel } from '../logs/lumberjack-log-level';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

import { LumberjackService } from './lumberjack.service';

class LumberjackLoggerBuilder<F extends Record<string, unknown> | void = void> {
  private context = '';
  private payload: F | undefined;

  constructor(
    private lumberjack: LumberjackService<F>,
    private time: LumberjackTimeService,
    private level: LumberjackLogLevel,
    private message: string
  ) {}

  withScope(context: string): LumberjackLoggerBuilder<F> {
    this.context = context;
    return this;
  }

  withPayload(...payloadArg: F extends void ? [never?] : [F]): LumberjackLoggerBuilder<void> {
    this.payload = payloadArg[0] as F;
    return (this as unknown) as LumberjackLoggerBuilder<void>;
  }

  build(): (...payloadArg: F extends void ? [never?] : [F]) => void {
    return (...payloadArg: F extends void ? [never?] : [F]) => {
      this.lumberjack.log({
        level: this.level,
        message: this.message,
        context: this.context,
        createdAt: this.time.getUnixEpochTicks(),
        payload: (payloadArg[0] as F) || this.payload,
      });
    };
  }
}

@Injectable()
// tslint:disable-next-line: no-any
export abstract class LumberjackLogger<F extends Record<string, unknown> | void = void> {
  constructor(private lumberjack: LumberjackService<F>, private time: LumberjackTimeService) {}

  protected createCriticalLogger(message: string): LumberjackLoggerBuilder<F> {
    return this.createLoggerBuilder(LumberjackLevel.Critical, message);
  }

  protected createDebugLogger(message: string): LumberjackLoggerBuilder<F> {
    return this.createLoggerBuilder(LumberjackLevel.Debug, message);
  }

  protected createErrorLogger(message: string): LumberjackLoggerBuilder<F> {
    return this.createLoggerBuilder(LumberjackLevel.Error, message);
  }

  protected createInfoLogger(message: string): LumberjackLoggerBuilder<F> {
    return this.createLoggerBuilder(LumberjackLevel.Info, message);
  }

  protected createTraceLogger(message: string): LumberjackLoggerBuilder<F> {
    return this.createLoggerBuilder(LumberjackLevel.Trace, message);
  }

  protected createWarningLogger(message: string): LumberjackLoggerBuilder<F> {
    return this.createLoggerBuilder(LumberjackLevel.Warning, message);
  }

  private createLoggerBuilder(level: LumberjackLogLevel, message: string): LumberjackLoggerBuilder<F> {
    return new LumberjackLoggerBuilder<F>(this.lumberjack, this.time, level, message);
  }
}
