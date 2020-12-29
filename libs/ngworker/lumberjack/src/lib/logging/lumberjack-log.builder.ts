import { LumberjackLogLevel } from '../logs/lumberjack-log-level';
import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';
import { LumberjackLog } from '../logs/lumberjack.log';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

export class LumberjackLogBuilder<TPayload extends LumberjackLogPayload | void = void> {
  private payload?: TPayload;
  private scope?: string;

  constructor(private time: LumberjackTimeService, private level: LumberjackLogLevel, private message: string) {}

  build(
    ...payloadArg: TPayload extends void | TPayload ? [never?] : [TPayload]
  ): LumberjackLog<Exclude<TPayload, void>> {
    return {
      level: this.level,
      message: this.message,
      scope: this.scope,
      createdAt: this.time.getUnixEpochTicks(),
      payload: (payloadArg[0] || this.payload) as Exclude<TPayload, void>,
    };
  }

  /**
   * Add payload with custom data to the `LumberjackLog`
   */
  withPayload(...payloadArg: TPayload extends void ? [never?] : [TPayload]): LumberjackLogBuilder<void | TPayload> {
    this.payload = payloadArg[0] as TPayload;

    return (this as unknown) as LumberjackLogBuilder<void | TPayload>;
  }

  /**
   * Add a scope to the `LumberjackLog`
   */
  withScope(scope: string): LumberjackLogBuilder<TPayload> {
    this.scope = scope;

    return this;
  }
}
