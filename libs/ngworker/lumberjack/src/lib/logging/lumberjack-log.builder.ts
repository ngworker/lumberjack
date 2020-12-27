import { LumberjackLogLevel } from '../logs/lumberjack-log-level';
import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

export class LumberjackLogBuilder<TPayload extends LumberjackLogPayload | void = void> {
  private payload?: TPayload;
  private scope?: string;

  constructor(private time: LumberjackTimeService, private level: LumberjackLogLevel, private message: string) {}

  build(...payloadArg: TPayload extends void ? [never?] : [TPayload]) {
    return {
      level: this.level,
      message: this.message,
      scope: this.scope,
      createdAt: this.time.getUnixEpochTicks(),
      payload: (payloadArg[0] as TPayload) || this.payload,
    };
  }

  /**
   * Add payload with custom data to the `LumberjackLog`
   */
  withPayload(...payloadArg: TPayload extends void ? [never?] : [TPayload]): LumberjackLogBuilder<void> {
    this.payload = payloadArg[0] as TPayload;

    return (this as unknown) as LumberjackLogBuilder<void>;
  }

  /**
   * Add a scope to the `LumberjackLog`
   */
  withScope(scope: string): LumberjackLogBuilder<TPayload> {
    this.scope = scope;

    return this;
  }
}
