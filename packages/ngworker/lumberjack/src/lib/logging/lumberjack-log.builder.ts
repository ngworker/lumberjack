import { LumberjackLogLevel } from '../logs/lumberjack-log-level';
import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';
import { LumberjackLog } from '../logs/lumberjack.log';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

/**
 * The generic parameter of `LumberjackLogBuilder` is evaluated to this type
 * when the `LumberjackLogBuilder#withPayload` method is used.
 */
type InternalWithStaticPayload = '__LUMBERJACK_INTERNAL_WITH_STATIC_PAYLOAD__' & LumberjackLogPayload;

/**
 * Builder for a log with the specified log level and message.
 *
 * Use this to create a log before passing it to `LumberjackService`.
 */
export class LumberjackLogBuilder<TPayload extends LumberjackLogPayload | void = void> {
  #payload?: TPayload;
  #scope?: string;
  readonly #time: LumberjackTimeService;
  readonly #level: LumberjackLogLevel;
  readonly #message: string;

  /**
   * Create a log builder with the specified log level and message.
   *
   * @param time Pass the `LumberjackTimeService`. Used for timestamping the log.
   * @param level The log level.
   * @param message The log message.
   */
  constructor(time: LumberjackTimeService, level: LumberjackLogLevel, message: string) {
    this.#time = time;
    this.#level = level;
    this.#message = message;
  }

  /**
   * Create a log with the specified properties and timestamp it.
   *
   * @param payloadArg Optional dynamic payload.
   */
  build(
    ...payloadArg: Extract<TPayload, InternalWithStaticPayload> extends never ? [TPayload] : [never?]
  ): LumberjackLog<Exclude<TPayload, InternalWithStaticPayload>> {
    return {
      level: this.#level,
      message: this.#message,
      scope: this.#scope,
      createdAt: this.#time.getUnixEpochTicks(),
      payload: (payloadArg[0] || this.#payload) as Exclude<TPayload, InternalWithStaticPayload>,
    };
  }

  /**
   * Optionally add a static payload to the log.
   */
  withPayload(
    ...payloadArg: TPayload extends void ? [never?] : [TPayload]
  ): LumberjackLogBuilder<InternalWithStaticPayload | TPayload> {
    this.#payload = payloadArg[0] as TPayload;

    return this as LumberjackLogBuilder<InternalWithStaticPayload | TPayload>;
  }

  /**
   * Add a scope to the log.
   */
  withScope(scope: string): LumberjackLogBuilder<TPayload> {
    this.#scope = scope;

    return this;
  }
}
