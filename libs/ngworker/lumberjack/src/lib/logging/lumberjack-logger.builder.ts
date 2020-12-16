import { LumberjackLogLevel } from '../logs/lumberjack-log-level';
import { Payload } from '../logs/payload';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

import { LumberjackService } from './lumberjack.service';

export class LumberjackLoggerBuilder<TPayload extends Payload | void = void> {
  private scope? = '';
  private payload?: TPayload;

  constructor(
    private lumberjack: LumberjackService<TPayload>,
    private time: LumberjackTimeService,
    private level: LumberjackLogLevel,
    private message: string
  ) {}

  build(): (...payloadArg: TPayload extends void ? [never?] : [TPayload]) => void {
    return (...payloadArg: TPayload extends void ? [never?] : [TPayload]) => {
      this.lumberjack.log({
        level: this.level,
        message: this.message,
        scope: this.scope,
        createdAt: this.time.getUnixEpochTicks(),
        payload: (payloadArg[0] as TPayload) || this.payload,
      });
    };
  }

  /**
   * Add a scope to the `LumberjackLog`
   */
  withScope(scope: string): LumberjackLoggerBuilder<TPayload> {
    this.scope = scope;

    return this;
  }

  /**
   * Add payload with custom data to the `LumberjackLog`
   */
  withPayload(...payloadArg: TPayload extends void ? [never?] : [TPayload]): LumberjackLoggerBuilder<void> {
    this.payload = payloadArg[0] as TPayload;

    return (this as unknown) as LumberjackLoggerBuilder<void>;
  }
}
