import { Level, LumberjackLevel } from './lumberjack-level';
import { LogLevel, LumberjackLogLevel } from './lumberjack-log-level';

/**
 * A set of Levels used to configure a log driver. Lumberjack filters logs
 * passed to the log driver based on its configured log levels.
 *
 * @deprecated use `ConfigLevels` instead. Enums will be removed in Lumberjack 19 in favor of string literal types.
 */
export type LumberjackConfigLevels = LumberjackLogLevel[] | [LumberjackLevel.Verbose];

/**
 * A set of Levels used to configure a log driver. Lumberjack filters logs
 * passed to the log driver based on its configured log levels.
 *
 * We recommend aliasing `ConfigLevels` to `LumberjackConfigLevels`. This will be the final name after removing enum based levels.
 *
 * @example
 * ```typescript
 * import { ConfigLevels as LumberjackConfigLevels } from '@ngworker/lumberjack';
 * ```
 */
export type ConfigLevels = LogLevel[] | [Extract<Level, 'verbose'>];
