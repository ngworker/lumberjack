import { LumberjackLogLevelComposable } from './lumberjack-log-levels';

/**
 * Represents a Lumberjack log.
 *
 */
export interface LumberjackLog {
  level: LumberjackLogLevelComposable;
  message: string;
  context: string | undefined;
}
