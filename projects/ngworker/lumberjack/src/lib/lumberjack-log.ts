import { LumberjackLogLevel } from './lumberjack-log-levels';

/**
 * Represents a Lumberjack specific log.
 *
 */
export interface LumberjackLog {
  level: LumberjackLogLevel;
  message: string;
  context: string | undefined;
}
