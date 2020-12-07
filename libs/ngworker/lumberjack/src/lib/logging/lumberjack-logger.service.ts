import { Injectable } from '@angular/core';

import { LumberjackLevel } from '../logs/lumberjack-level';
import { LumberjackLogLevel } from '../logs/lumberjack-log-level';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

import { LumberjackService } from './lumberjack.service';

@Injectable()
// tslint:disable-next-line: no-any
export abstract class LumberjackLogger<F extends Record<string, any> | undefined = undefined> {
  constructor(private lumberjack: LumberjackService<F>, private time: LumberjackTimeService) {}

  protected createCriticalLogger(message: string, context?: string, extra?: F): () => void {
    return this.createLogger(LumberjackLevel.Critical, message, context, extra);
  }

  protected createDebugLogger(message: string, context?: string, extra?: F): () => void {
    return this.createLogger(LumberjackLevel.Debug, message, context, extra);
  }

  protected createErrorLogger(message: string, context?: string, extra?: F): () => void {
    return this.createLogger(LumberjackLevel.Error, message, context, extra);
  }

  protected createInfoLogger(message: string, context?: string, extra?: F): () => void {
    return this.createLogger(LumberjackLevel.Info, message, context, extra);
  }

  protected createTraceLogger(message: string, context?: string, extra?: F): () => void {
    return this.createLogger(LumberjackLevel.Trace, message, context, extra);
  }

  protected createWarningLogger(message: string, context?: string, extra?: F): () => void {
    return this.createLogger(LumberjackLevel.Warning, message, context, extra);
  }

  private createLogger(level: LumberjackLogLevel, message: string, context?: string, extra?: F): () => void {
    return () => {
      this.lumberjack.log({ context, createdAt: this.time.getUnixEpochTicks(), level, message, extra });
    };
  }
}
