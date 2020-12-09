import { Injectable } from '@angular/core';

import { LumberjackLogLevel } from '../logs/lumberjack-log-level';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

import { LumberjackService } from './lumberjack.service';

export class LumberjackLoggerBuilder<TPayload extends Readonly<{ [key: string]: unknown }> | void = void> {
  private context = '';
  private payload: TPayload | undefined;

  constructor(
    private lumberjack: LumberjackService<TPayload>,
    private time: LumberjackTimeService,
    private level: LumberjackLogLevel,
    private message: string
  ) {}

  withScope(context: string): LumberjackLoggerBuilder<TPayload> {
    this.context = context;
    return this;
  }

  withPayload(...payloadArg: TPayload extends void ? [never?] : [TPayload]): LumberjackLoggerBuilder<void> {
    this.payload = payloadArg[0] as TPayload;
    return (this as unknown) as LumberjackLoggerBuilder<void>;
  }

  build(): (...payloadArg: TPayload extends void ? [never?] : [TPayload]) => void {
    return (...payloadArg: TPayload extends void ? [never?] : [TPayload]) => {
      this.lumberjack.log({
        level: this.level,
        message: this.message,
        context: this.context,
        createdAt: this.time.getUnixEpochTicks(),
        payload: (payloadArg[0] as TPayload) || this.payload,
      });
    };
  }
}
