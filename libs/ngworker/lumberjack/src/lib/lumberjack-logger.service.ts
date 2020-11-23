import { Injectable } from '@angular/core';

import { LumberjackLogEntryLevel, LumberjackLogLevel } from './lumberjack-log-levels';
import { LumberjackService } from './lumberjack.service';
import { LumberjackTimeService } from './time/lumberjack-time.service';

@Injectable()
export abstract class LumberjackLogger {
  constructor(private lumberjack: LumberjackService, private time: LumberjackTimeService) {}

  protected createCriticalLogger(message: string, context?: string): () => void {
    return this.createLogger(LumberjackLogLevel.Critical, message, context);
  }

  protected createDebugLogger(message: string, context?: string): () => void {
    return this.createLogger(LumberjackLogLevel.Debug, message, context);
  }

  protected createErrorLogger(message: string, context?: string): () => void {
    return this.createLogger(LumberjackLogLevel.Error, message, context);
  }

  protected createInfoLogger(message: string, context?: string): () => void {
    return this.createLogger(LumberjackLogLevel.Info, message, context);
  }

  protected createTraceLogger(message: string, context?: string): () => void {
    return this.createLogger(LumberjackLogLevel.Trace, message, context);
  }

  protected createWarningLogger(message: string, context?: string): () => void {
    return this.createLogger(LumberjackLogLevel.Warning, message, context);
  }

  private createLogger(level: LumberjackLogEntryLevel, message: string, context?: string): () => void {
    return () => {
      this.lumberjack.log({ context, createdAt: this.time.getUnixEpochTicks(), level, message });
    };
  }
}
