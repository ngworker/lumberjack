import { Level, LumberjackLevel } from './lumberjack-level';

/**
 * Level used to represent severity of a log.
 *
 * @deprecated use `LogLevel` instead. Enums will be removed in Lumberjack 19 in favor of string literal types.
 */
export type LumberjackLogLevel = Exclude<LumberjackLevel, LumberjackLevel.Verbose>;

/**
 * Level used to represent severity of a log.
 *
 * We recommend aliasing `LogLevel` to `LumberjackLogLevel`. This will be the final name after removing enum based levels.
 *
 * @example
 * ```typescript
 * import { LogLevel as LumberjackLogLevel } from '@ngworker/lumberjack';
 * ```
 */
export type LogLevel = Exclude<Level, 'verbose'>;
