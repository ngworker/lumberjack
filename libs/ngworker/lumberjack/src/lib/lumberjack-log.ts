import { LumberjackLogEntryLevel } from './lumberjack-log-levels';

/**
 * Represents a Lumberjack log.
 *
 */
export interface LumberjackLog {
  level: LumberjackLogEntryLevel;
  message: string;
  context: string | undefined;
}
