import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';
import { LumberjackLog } from '../logs/lumberjack.log';

import { LumberjackLogDriver } from './lumberjack-log-driver';

/**
 * A log driver error reported by Lumberjack.
 */
export interface LumberjackLogDriverError<TPayload extends LumberjackLogPayload | void = void> {
  readonly formattedLog: string;
  readonly error: unknown;
  readonly log: LumberjackLog<TPayload>;
  readonly logDriver: LumberjackLogDriver<TPayload>;
}
