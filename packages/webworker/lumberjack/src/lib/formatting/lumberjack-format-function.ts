import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';

import { lumberjackFormatLog } from './lumberjack-format-log';

/**
 * The overridable Lumberjack format function is used to create the string
 * representation of a Lumberjack log.
 */
export type LumberjackFormatFunction<TPayload extends LumberjackLogPayload | void = void> =
  typeof lumberjackFormatLog<TPayload>;
