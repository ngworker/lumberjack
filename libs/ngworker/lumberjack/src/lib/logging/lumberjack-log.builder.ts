import { LumberjackLogLevel } from '../logs/lumberjack-log-level';
import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';
import { LumberjackLog } from '../logs/lumberjack.log';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

type Empty = 'empty' & LumberjackLogPayload;

export class LumberjackLogBuilder<TPayload extends LumberjackLogPayload | void = void> {
  private payload?: TPayload;
  private scope?: string;

  constructor(private time: LumberjackTimeService, private level: LumberjackLogLevel, private message: string) {}

  build(
    ...payloadArg: Extract<TPayload, Empty> extends never ? [TPayload] : [never?]
  ): LumberjackLog<Exclude<TPayload, Empty>> {
    return {
      level: this.level,
      message: this.message,
      scope: this.scope,
      createdAt: this.time.getUnixEpochTicks(),
      payload: (payloadArg[0] || this.payload) as Exclude<TPayload, Empty>,
    };
  }

  /**
   * Add payload with custom data to the `LumberjackLog`
   */
  withPayload(...payloadArg: TPayload extends void ? [never?] : [TPayload]): LumberjackLogBuilder<Empty | TPayload> {
    this.payload = payloadArg[0] as TPayload;

    return (this as unknown) as LumberjackLogBuilder<Empty | TPayload>;
  }

  /**
   * Add a scope to the `LumberjackLog`
   */
  withScope(scope: string): LumberjackLogBuilder<TPayload> {
    this.scope = scope;

    return this;
  }
}
