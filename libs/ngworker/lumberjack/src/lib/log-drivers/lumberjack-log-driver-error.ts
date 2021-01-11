import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';

import { LumberjackLogDriver } from './lumberjack-log-driver';

export interface LumberjackLogDriverError<TPayload extends LumberjackLogPayload | void = void> {
  readonly formattedLog: string;
  readonly error: unknown;
  readonly logDriver: LumberjackLogDriver<TPayload>;
}
