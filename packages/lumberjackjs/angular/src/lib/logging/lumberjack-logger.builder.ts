import { LumberjackLogLevel, LumberjackLogPayload } from '@lumberjackjs/core';

import { LumberjackTimeService } from '../time/lumberjack-time.service';

import { LumberjackOrchestrator } from './lumberjack-orchestrator.service';

export class LumberjackLoggerBuilder<TPayload extends LumberjackLogPayload | void = void> {
  #scope?: string;
  #payload?: TPayload;
  readonly #lumberjack: LumberjackOrchestrator<TPayload>;
  readonly #time: LumberjackTimeService;
  readonly #level: LumberjackLogLevel;
  readonly #message: string;

  constructor(
    lumberjack: LumberjackOrchestrator<TPayload>,
    time: LumberjackTimeService,
    level: LumberjackLogLevel,
    message: string
  ) {
    this.#lumberjack = lumberjack;
    this.#time = time;
    this.#level = level;
    this.#message = message;
  }

  build(): (...payloadArg: TPayload extends void ? [never?] : [TPayload]) => void {
    return (...payloadArg: TPayload extends void ? [never?] : [TPayload]) => {
      this.#lumberjack.log({
        level: this.#level,
        message: this.#message,
        scope: this.#scope,
        createdAt: this.#time.getUnixEpochTicks(),
        payload: (payloadArg[0] as TPayload) ?? this.#payload,
      });
    };
  }

  /**
   * Add a scope to the `LumberjackLog`
   */
  withScope(scope: string): LumberjackLoggerBuilder<TPayload> {
    this.#scope = scope;

    return this;
  }

  /**
   * Add payload with custom data to the `LumberjackLog`
   */
  withPayload(...payloadArg: TPayload extends void ? [never?] : [TPayload]): LumberjackLoggerBuilder {
    this.#payload = payloadArg[0] as TPayload;

    return this as unknown as LumberjackLoggerBuilder;
  }
}
