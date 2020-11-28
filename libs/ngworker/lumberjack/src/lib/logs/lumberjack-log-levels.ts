/*
 * Log levels used by our `Lumberjack` Loggers
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

export type LumberjackLogConfigLevels = ReadonlyArray<LumberjackLogEntryLevel> | [LumberjackLevel.Verbose];

export type LumberjackLogEntryLevel = Exclude<LumberjackLevel, LumberjackLevel.Verbose>;
