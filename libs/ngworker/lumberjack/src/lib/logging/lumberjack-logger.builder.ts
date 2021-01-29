import { LumberjackLogLevel } from '../logs/lumberjack-log-level';
import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

import { LumberjackService } from './lumberjack.service';

export class LumberjackLoggerBuilder<TPayload extends LumberjackLogPayload | void = void> {
  private scope?: string;
  private payload?: TPayload;

  constructor(
    private readonly lumberjack: LumberjackService<TPayload>,
    private readonly time: LumberjackTimeService,
    private readonly level: LumberjackLogLevel,
    private readonly message: string
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
  withPayload(...payloadArg: TPayload extends void ? [never?] : [TPayload]): LumberjackLoggerBuilder {
    this.payload = payloadArg[0] as TPayload;

    return (this as unknown) as LumberjackLoggerBuilder;
  }
}
