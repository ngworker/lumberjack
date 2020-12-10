import { Payload } from '../logs/payload';

import { LumberjackLogDriver } from './lumberjack-log-driver';

export interface LumberjackLogDriverError<TPayload extends Readonly<Payload> | void = void> {
  readonly formattedLog: string;
  readonly error: unknown;
  readonly logDriver: LumberjackLogDriver<TPayload>;
}
