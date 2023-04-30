import { LumberjackLevel } from './lumberjack-level';
import { LumberjackLogLevel } from './lumberjack-log-level';

/**
 * A set of Levels used to configure a log driver. Lumberjack filters logs
 * passed to the log driver based on its configured log levels.
 */
export type LumberjackConfigLevels = LumberjackLogLevel[] | [LumberjackLevel.Verbose];
