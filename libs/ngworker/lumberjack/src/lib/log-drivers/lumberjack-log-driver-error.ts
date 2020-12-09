import { LumberjackLogDriver } from './lumberjack-log-driver';

export interface LumberjackLogDriverError<TPayload extends Readonly<{ [key: string]: unknown }> | void = void> {
  readonly formattedLog: string;
  readonly error: unknown;
  readonly logDriver: LumberjackLogDriver<TPayload>;
}
