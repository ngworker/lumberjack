/**
 * All supported levels supported by Lumberjack. Used to specify the severity of a log and to configure Lumberjack and the log drivers.
 *
 * @deprecated use `Level` instead. Enums will be removed in Lumberjack 19 in favor of string literal types.
 *
 */
export enum LumberjackLevel {
  Critical = 'critical',
  Debug = 'debug',
  Error = 'error',
  Info = 'info',
  Trace = 'trace',
  Verbose = 'verbose',
  Warning = 'warn',
}

/**
 * All supported levels supported by Lumberjack. Used to specify the severity of a log and to configure Lumberjack and the log drivers.
 *
 * We recommend aliasing `Level` to `LumberjackLevel`. This will be the final name after removing enum based levels.
 *
 * @example
 * ```typescript
 * import { Level as LumberjackLevel } from '@ngworker/lumberjack';
 * ```
 */
export type Level = 'critical' | 'debug' | 'error' | 'info' | 'trace' | 'verbose' | 'warn';
