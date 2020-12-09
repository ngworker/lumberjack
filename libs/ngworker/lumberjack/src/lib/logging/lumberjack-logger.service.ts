import { Injectable } from '@angular/core';

import { LumberjackLevel } from '../logs/lumberjack-level';
import { LumberjackLogLevel } from '../logs/lumberjack-log-level';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

import { LumberjackService } from './lumberjack.service';

@Injectable()
export abstract class LumberjackLogger {
  constructor(private lumberjack: LumberjackService, private time: LumberjackTimeService) {}

  protected createCriticalLogger(message: string, scope?: string): () => void {
    return this.createLogger(LumberjackLevel.Critical, message, scope);
  }

  protected createDebugLogger(message: string, scope?: string): () => void {
    return this.createLogger(LumberjackLevel.Debug, message, scope);
  }

  protected createErrorLogger(message: string, scope?: string): () => void {
    return this.createLogger(LumberjackLevel.Error, message, scope);
  }

  protected createInfoLogger(message: string, scope?: string): () => void {
    return this.createLogger(LumberjackLevel.Info, message, scope);
  }

  protected createTraceLogger(message: string, scope?: string): () => void {
    return this.createLogger(LumberjackLevel.Trace, message, scope);
  }

  protected createWarningLogger(message: string, scope?: string): () => void {
    return this.createLogger(LumberjackLevel.Warning, message, scope);
  }

  private createLogger(level: LumberjackLogLevel, message: string, scope?: string): () => void {
    return () => {
      this.lumberjack.log({ scope, createdAt: this.time.getUnixEpochTicks(), level, message });
    };
  }
}
