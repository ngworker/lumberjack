import { Injectable } from '@angular/core';

import { LumberjackLevel } from '../logs/lumberjack-level';
import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

import { LumberjackLogBuilder } from './lumberjack-log.builder';

@Injectable({
  providedIn: 'root',
})
export class LumberjackLogFactory<TPayload extends LumberjackLogPayload | void = void> {
  constructor(private time: LumberjackTimeService) {}

  createCriticalLog(message: string): LumberjackLogBuilder<TPayload> {
    return new LumberjackLogBuilder(this.time, LumberjackLevel.Critical, message);
  }

  createDebugLog(message: string): LumberjackLogBuilder<TPayload> {
    return new LumberjackLogBuilder(this.time, LumberjackLevel.Debug, message);
  }

  createErrorLog(message: string): LumberjackLogBuilder<TPayload> {
    return new LumberjackLogBuilder(this.time, LumberjackLevel.Error, message);
  }

  createInfoLog(message: string): LumberjackLogBuilder<TPayload> {
    return new LumberjackLogBuilder(this.time, LumberjackLevel.Info, message);
  }

  createTraceLog(message: string): LumberjackLogBuilder<TPayload> {
    return new LumberjackLogBuilder(this.time, LumberjackLevel.Trace, message);
  }

  createWarningLog(message: string): LumberjackLogBuilder<TPayload> {
    return new LumberjackLogBuilder(this.time, LumberjackLevel.Warning, message);
  }
}
