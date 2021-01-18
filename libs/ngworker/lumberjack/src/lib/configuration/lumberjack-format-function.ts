import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';
import { LumberjackLog } from '../logs/lumberjack.log';

/**
 * The overridable Lumberjack format function is used to create the string
 * representation of a Lumberjack log.
 */
export type LumberjackFormatFunction<TPayload extends LumberjackLogPayload | void = void> = (
  log: LumberjackLog<TPayload>
) => string;
